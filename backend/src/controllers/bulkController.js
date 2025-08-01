import Habit from '../models/habitModel.js';
import { sanitizeHabit } from '../utils/sanitizer.js';
import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';
import { createObjectCsvWriter } from 'csv-writer';
import mongoose from 'mongoose';

// POST /api/habits/bulk/import
export const importHabits = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    const filePath = req.file.path;
    const fileExtension = path.extname(req.file.originalname).toLowerCase();

    if (fileExtension === '.csv') {
      await handleCSVImport(filePath, res);
    } else if (fileExtension === '.json') {
      await handleJSONImport(filePath, res);
    } else {
      return res.status(400).json({
        success: false,
        message: 'Unsupported file format'
      });
    }
  } catch (error) {
    if (req.file?.path) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (cleanupError) {
        console.error('Error cleaning up file:', cleanupError);
      }
    }

    console.error('Error in importHabits:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

export const handleCSVImport = async (filePath, res) => {
  const importedHabits = [];
  const errors = [];
  let rowIndex = 0;

  fs.createReadStream(filePath)
    .pipe(csv())
    .on('data', (row) => {
      rowIndex++;
      try {
        const habit = validateImportedHabit(row, rowIndex);
        if (habit.errors.length > 0) {
          errors.push(...habit.errors);
          return;
        }
        importedHabits.push(habit.data);
      } catch (error) {
        errors.push(`Row ${rowIndex}: ${error.message}`);
      }
    })
    .on('end', async () => {
      fs.unlinkSync(filePath);

      if (errors.length > 0) {
        return res.status(400).json({
          success: false,
          message: 'Import failed with validation errors',
          errors
        });
      }

      try {
        const createdHabits = await Habit.insertMany(importedHabits, {
          ordered: false,
          validateBeforeSave: true
        });

        res.status(200).json({
          success: true,
          message: `Successfully imported ${createdHabits.length} habits`,
          data: {
            imported: createdHabits.length,
            habits: createdHabits
          }
        });
      } catch (dbError) {
        console.error('Database error during bulk import:', dbError);
        res.status(500).json({
          success: false,
          message: 'Database error during import',
          error: dbError.message
        });
      }
    })
    .on('error', (error) => {
      fs.unlinkSync(filePath);
      res.status(400).json({
        success: false,
        message: 'Failed to parse CSV file',
        error: error.message
      });
    });
};

export const handleJSONImport = async (filePath, res) => {
  fs.readFile(filePath, 'utf8', async (err, data) => {
    fs.unlinkSync(filePath);

    if (err) {
      return res.status(400).json({
        success: false,
        message: 'Failed to read JSON file',
        error: err.message
      });
    }

    try {
      const jsonData = JSON.parse(data);
      const habitsArray = Array.isArray(jsonData) ? jsonData : [jsonData];
      const importedHabits = [];
      const errors = [];

      habitsArray.forEach((habitData, index) => {
        try {
          const habit = validateImportedHabit(habitData, index + 1);
          if (habit.errors.length > 0) {
            errors.push(...habit.errors);
            return;
          }
          importedHabits.push(habit.data);
        } catch (error) {
          errors.push(`Item ${index + 1}: ${error.message}`);
        }
      });

      if (errors.length > 0) {
        return res.status(400).json({
          success: false,
          message: 'Import failed with validation errors',
          errors
        });
      }

      const createdHabits = await Habit.insertMany(importedHabits, {
        ordered: false,
        validateBeforeSave: true
      });

      res.status(200).json({
        success: true,
        message: `Successfully imported ${createdHabits.length} habits`,
        data: {
          imported: createdHabits.length,
          habits: createdHabits
        }
      });
    } catch (error) {
      console.error('Error in JSON import:', error);
      const status = error.name === 'SyntaxError' ? 400 : 500;
      res.status(status).json({
        success: false,
        message: error.name === 'SyntaxError' ? 'Invalid JSON format' : 'Database error during import',
        error: error.message
      });
    }
  });
};

export const validateImportedHabit = (habitData, index) => {
  const errors = [];

  const habit = {
    name: typeof habitData.name === 'string' ? habitData.name.trim() : habitData.name,
    description: typeof habitData.description === 'string' ? habitData.description.trim() : habitData.description,
    category: typeof habitData.category === 'string' ? habitData.category.trim() : habitData.category,
    frequency: typeof habitData.frequency === 'string' ? habitData.frequency.trim() : habitData.frequency,
    targetValue: habitData.targetValue ? parseInt(habitData.targetValue) : undefined,
    unit: typeof habitData.unit === 'string' ? habitData.unit.trim() : habitData.unit,
    isActive: habitData.isActive === 'true' || habitData.isActive === true,
    reminderTime: typeof habitData.reminderTime === 'string' ? habitData.reminderTime.trim() : habitData.reminderTime,
    tags: habitData.tags ?
      (typeof habitData.tags === 'string' ? habitData.tags.split(',').map(tag => tag.trim()) : habitData.tags) : []
  };

  if (!habit.name || habit.name.length === 0) {
    errors.push(`Row/Item ${index}: Name is required`);
  }

  if (!['health', 'productivity', 'learning', 'fitness', 'mindfulness', 'social', 'other'].includes(habit.category)) {
    errors.push(`Row/Item ${index}: Invalid category`);
  }

  if (!['daily', 'weekly', 'monthly'].includes(habit.frequency)) {
    errors.push(`Row/Item ${index}: Invalid frequency`);
  }

  return {
    data: sanitizeHabit(habit),
    errors
  };
};

// GET /api/habits/bulk/export
export const exportHabits = async (req, res) => {
  try {
    const format = req.query.format || 'json';
    const userId = req.query.userId;
    const query = userId ? { userId: new mongoose.Types.ObjectId(userId) } : {};
    const habits = await Habit.find(query).sort({ createdAt: -1 });

    if (format === 'csv') {
      const csvWriter = createObjectCsvWriter({
        path: 'exports/habits.csv',
        header: [
          { id: '_id', title: 'ID' },
          { id: 'name', title: 'Name' },
          { id: 'description', title: 'Description' },
          { id: 'category', title: 'Category' },
          { id: 'frequency', title: 'Frequency' },
          { id: 'targetValue', title: 'Target Value' },
          { id: 'unit', title: 'Unit' },
          { id: 'isActive', title: 'Active' },
          { id: 'reminderTime', title: 'Reminder Time' },
          { id: 'tags', title: 'Tags' },
          { id: 'streak', title: 'Streak' },
          { id: 'createdAt', title: 'Created At' },
          { id: 'updatedAt', title: 'Updated At' }
        ]
      });

      const csvData = habits.map(habit => ({
        ...habit.toObject(),
        tags: habit.tags?.join(', ') || ''
      }));

      await csvWriter.writeRecords(csvData);

      res.download('exports/habits.csv', 'habits.csv', (err) => {
        if (err) {
          console.error('CSV download error:', err);
          return res.status(500).json({
            success: false,
            message: 'Failed to download CSV file',
            error: err.message
          });
        }

        try {
          fs.unlinkSync('exports/habits.csv');
        } catch (cleanupError) {
          console.error('Error cleaning up CSV file:', cleanupError);
        }
      });
    } else {
      res.setHeader('Content-Disposition', 'attachment; filename=habits.json');
      res.setHeader('Content-Type', 'application/json');
      res.status(200).json({
        success: true,
        exportedAt: new Date().toISOString(),
        totalHabits: habits.length,
        data: habits
      });
    }
  } catch (error) {
    console.error('Error in exportHabits:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// DELETE /api/habits/bulk/delete
export const bulkDeleteHabits = async (req, res) => {
  try {
    const idsToDelete = req.body.ids;
    const invalidIds = idsToDelete.filter(id => !mongoose.Types.ObjectId.isValid(id));

    if (invalidIds.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid habit ID format',
        invalidIds
      });
    }

    const objectIds = idsToDelete.map(id => new mongoose.Types.ObjectId(id));
    const existingHabits = await Habit.find({ _id: { $in: objectIds } });
    const existingIds = existingHabits.map(habit => habit._id.toString());
    const notFoundIds = idsToDelete.filter(id => !existingIds.includes(id));

    const deleteResult = await Habit.deleteMany({ _id: { $in: objectIds } });

    res.status(200).json({
      success: true,
      message: `Successfully deleted ${deleteResult.deletedCount} habits`,
      data: {
        deleted: existingHabits,
        notFound: notFoundIds,
        deletedCount: deleteResult.deletedCount
      }
    });
  } catch (error) {
    console.error('Error in bulkDeleteHabits:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};
