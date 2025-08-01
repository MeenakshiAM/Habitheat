import React, { useEffect, useState } from 'react';
import { ArrowLeft, Clock, Target, Lightbulb, Plus, Trash2, Share2 } from 'lucide-react';
import { HabitTemplate } from '../types';
import { HABIT_TEMPLATES, getTemplatesByCategory } from '../utils/habitTemplates';
import { motion, AnimatePresence } from 'framer-motion'; // Animation: Import Framer Motion

interface HabitTemplatesViewProps {
  onBack: () => void;
  onUseTemplate: (template: HabitTemplate) => void;
  customTemplates: HabitTemplate[];
  onDeleteTemplate: (id: string) => void;
}

export const HabitTemplatesView: React.FC<HabitTemplatesViewProps> = ({ onBack, onUseTemplate, onDeleteTemplate, customTemplates = [] }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedTemplate, setSelectedTemplate] = useState<HabitTemplate | null>(null);
  const [userTemplates, setUserTemplates] = useState<HabitTemplate[]>(customTemplates);

  const allTemplates = [...HABIT_TEMPLATES, ...customTemplates];
  const categories = ['all', ...Array.from(new Set(allTemplates.map(t => t.category)))];
  const filteredTemplates = selectedCategory === 'all' 
    ? allTemplates 
    : allTemplates.filter(t => t.category === selectedCategory);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300';
      case 'medium': return 'bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300';
      case 'hard': return 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300';
      default: return 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300';
    }
  };

  // tabtitle
  useEffect(()=>{
    document.title='Habit Heat-Templates'
  },[])

  const handleShareTemplate = (template: HabitTemplate) => {
    const subject = encodeURIComponent(`Check out this Habit Heat Template: ${template.name}`);

    const body = encodeURIComponent(
      `Hey, \n\n I found this great habit template from Habit Heat and thought you might like it: \n` + 
      `Name: ${template.name} \n Category: ${template.category} \n Difficulty: ${template.difficulty}\n` +
      `Estimated Time: ${template.estimatedTime} minutes \n Frequency: ${template.daysPerWeek} days/week \n\n` +
      `Description: \n ${template.description} \n\n` + 
      `Tips: \n ${template.tips?.join('\n') || 'Stay Determined!'} \n\n` +
      `Motivational Quote : ${template.motivationalQuote || ''} \n\n` +
      `Cheers!`
    );

    window.open(`https://mail.google.com/mail/?view=cm&fs=1&su=${subject}&body=${body}`, '_blank');
  }

  const handleDeleteTemplate = (id: string) => {
    if(window.confirm("Are you sure you want to delete the selected template?")) {
      onDeleteTemplate(id);
      alert("Template deleted successfully!");
    }
    
  }

  if (selectedTemplate) {

    const tipsToShow = (selectedTemplate.tips?.filter(tip => tip.trim())?.length 
      ? selectedTemplate.tips.filter(tip => tip.trim()) 
      : ["Stay determined!"]);
    return (
      <motion.div 
        // Animation: Template details modal entrance
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="max-w-2xl mx-auto px-4 py-6"
      >
        <div className="flex justify-between py-2 items-center">
          {/* Animation: Back button with hover effects */}
          <motion.button
            onClick={() => setSelectedTemplate(null)}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors mb-6"
            whileHover={{ 
              x: -5,
              transition: { duration: 0.15 }
            }}
            whileTap={{ 
              scale: 0.95,
              transition: { duration: 0.05 }
            }}
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Templates</span>
          </motion.button>
          {/* Animation: Share button with hover effects */}
          <motion.button
            onClick={(e) => { e.stopPropagation(); handleShareTemplate(selectedTemplate); }}
            className="p-4 rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600"
            whileHover={{ 
              scale: 1.15,
              transition: { duration: 0.2 }
            }}
            whileTap={{ 
              scale: 0.95,
              transition: { duration: 0.05 }
            }}
          >
            <Share2 className="w-4 h-4 text-gray-600 dark:text-gray-300" />
          </motion.button>
        </div>
        
        {/* Animation: Template details card with enhanced entrance */}
        <motion.div 
          className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm border border-gray-100 dark:border-gray-700"
          initial={{ opacity: 0, y: 30, scale: 0.95, rotateY: -5 }}
          animate={{ opacity: 1, y: 0, scale: 1, rotateY: 0 }}
          transition={{ 
            duration: 0.6, 
            ease: [0.25, 0.46, 0.45, 0.94],
            type: "spring",
            stiffness: 80,
            damping: 12
          }}
          whileHover={{ 
            scale: 1.02,
            rotateY: 2,
            transition: { duration: 0.3, ease: "easeOut" }
          }}
        >
          <div className="flex items-center gap-4 mb-6">
            {/* Animation: Template emoji with entrance */}
            <motion.span 
              className="text-4xl"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ 
                duration: 0.6,
                ease: "easeOut",
                delay: 0.2
              }}
            >
              {selectedTemplate.emoji}
            </motion.span>
            <div>
              <motion.h1 
                className="text-2xl font-bold text-gray-900 dark:text-white"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.3 }}
              >
                {selectedTemplate.name}
              </motion.h1>
              <motion.div 
                className="flex items-center gap-3 mt-2"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.4 }}
              >
                <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-full text-sm">
                  {selectedTemplate.category}
                </span>
                <span className={`px-2 py-1 rounded-full text-sm font-medium ${getDifficultyColor(selectedTemplate.difficulty)}`}>
                  {selectedTemplate.difficulty}
                </span>
              </motion.div>
            </div>
          </div>

          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.5 }}
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Description</h3>
              <p className="text-gray-600 dark:text-gray-400">{selectedTemplate.description}</p>
            </motion.div>

            {/* Animation: Stats grid with staggered entrance */}
            <motion.div 
              className="grid md:grid-cols-2 gap-6"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.1,
                    delayChildren: 0.6,
                  },
                },
              }}
            >
              <motion.div 
                className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl"
                variants={{
                  hidden: { opacity: 0, x: -20 },
                  visible: { 
                    opacity: 1, 
                    x: 0,
                    transition: { duration: 0.3, ease: "easeOut" }
                  },
                }}
                whileHover={{ 
                  scale: 1.05,
                  y: -8,
                  rotateY: 3,
                  boxShadow: "0 15px 35px rgba(0,0,0,0.1)",
                  transition: { duration: 0.3, ease: "easeOut" }
                }}
              >
                <Clock className="w-5 h-5 text-blue-500" />
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">
                    {selectedTemplate.estimatedTime} minutes
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Estimated time</div>
                </div>
              </motion.div>

              <motion.div 
                className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl"
                variants={{
                  hidden: { opacity: 0, x: 20 },
                  visible: { 
                    opacity: 1, 
                    x: 0,
                    transition: { duration: 0.3, ease: "easeOut" }
                  },
                }}
                whileHover={{ 
                  scale: 1.05,
                  y: -8,
                  rotateY: -3,
                  boxShadow: "0 15px 35px rgba(0,0,0,0.1)",
                  transition: { duration: 0.3, ease: "easeOut" }
                }}
              >
                <Target className="w-5 h-5 text-green-500" />
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">
                    {selectedTemplate.daysPerWeek} days/week
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Recommended frequency</div>
                </div>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.8 }}
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-yellow-500" />
                Tips for Success
              </h3>
              <ul className="space-y-2">
                {tipsToShow.map((tip, index) => (
                  <motion.li 
                    key={index} 
                    className="flex items-start gap-3"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.9 + index * 0.1 }}
                  >
                    <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                    <span className="text-gray-600 dark:text-gray-400">{tip}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            {/* Animation: Motivational quote with enhanced entrance */}
            {selectedTemplate.motivationalQuote?.trim() && (
              <motion.div 
                className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl border border-blue-100 dark:border-blue-800"
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.5, delay: 1.0 }}
                whileHover={{ 
                  scale: 1.05,
                  y: -5,
                  rotateY: 2,
                  boxShadow: "0 10px 25px rgba(59, 130, 246, 0.2)",
                  transition: { duration: 0.3, ease: "easeOut" }
                }}
              >
                <p className="text-blue-800 dark:text-blue-200 font-medium italic">
                  "{selectedTemplate.motivationalQuote}"
                </p>
              </motion.div>
            )}

            {/* Animation: Use template button with enhanced hover effects */}
            <motion.button
              onClick={() => onUseTemplate(selectedTemplate)}
              className="w-full px-6 py-4 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 1.1 }}
              whileHover={{ 
                scale: 1.03,
                y: -3,
                boxShadow: "0 10px 25px rgba(59, 130, 246, 0.4)",
                transition: { duration: 0.3, ease: "easeOut" }
              }}
              whileTap={{ 
                scale: 0.98,
                transition: { duration: 0.05 }
              }}
            >
              <Plus className="w-5 h-5" />
              Use This Template
                         </motion.button>
           </div>
         </motion.div>
       </motion.div>
     );
   }

  return (
    <motion.div 
      // Animation: Page entrance with fade and slide
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="max-w-6xl mx-auto px-4 py-6"
    >
      {/* Animation: Back button with hover effects */}
      <motion.button
        onClick={onBack}
        className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors mb-6"
        whileHover={{ 
          x: -5,
          transition: { duration: 0.15 }
        }}
        whileTap={{ 
          scale: 0.95,
          transition: { duration: 0.05 }
        }}
      >
        <ArrowLeft className="w-5 h-5" />
        <span>Back to Dashboard</span>
      </motion.button>

      {/* Animation: Page heading with staggered text entrance */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="mb-8"
      >
        <motion.h2 
          className="text-2xl font-bold text-gray-900 dark:text-white mb-2"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Habit Templates
        </motion.h2>
        <motion.p 
          className="text-gray-500 dark:text-gray-400"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          Get started quickly with proven habit templates
        </motion.p>
      </motion.div>

      {/* Animation: Category filter buttons with staggered entrance */}
      <motion.div 
        className="flex flex-wrap gap-2 mb-6"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: {
              staggerChildren: 0.05,
              delayChildren: 0.4,
            },
          },
        }}
      >
        {categories.map((category, index) => (
          <motion.button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              selectedCategory === category
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
            variants={{
              hidden: { opacity: 0, y: 20, scale: 0.8 },
              visible: { 
                opacity: 1, 
                y: 0, 
                scale: 1,
                transition: { duration: 0.3, ease: "easeOut" }
              },
            }}
            whileHover={{ 
              scale: 1.1,
              y: -2,
              transition: { duration: 0.2 }
            }}
            whileTap={{ 
              scale: 0.95,
              transition: { duration: 0.05 }
            }}
          >
            {category === 'all' ? 'All Categories' : category}
          </motion.button>
        ))}
      </motion.div>

      {/* Animation: Templates grid with staggered entrance */}
      <motion.div 
        className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: {
              staggerChildren: 0.1,
              delayChildren: 0.6,
            },
          },
        }}
      >
        {filteredTemplates.map((template, index) => {
          const isCustom = userTemplates.some(t => t.id === template.id);
          return (
                         <motion.div
               key={template.id}
               className="relative"
               variants={{
                 hidden: { opacity: 0, y: 30, scale: 0.95 },
                 visible: { 
                   opacity: 1, 
                   y: 0, 
                   scale: 1,
                   transition: { duration: 0.4, ease: "easeOut" }
                 },
               }}
               whileHover={{ 
                 y: -8, 
                 scale: 1.02,
                 transition: { duration: 0.3, ease: "easeOut" }
               }}
               whileTap={{ 
                 scale: 0.98,
                 transition: { duration: 0.05 }
               }}
             >
                               <motion.div 
                  className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 relative"
                  initial={{ opacity: 0, scale: 0.95, rotateY: -5 }}
                  animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                  transition={{ 
                    duration: 0.6, 
                    ease: [0.25, 0.46, 0.45, 0.94],
                    type: "spring",
                    stiffness: 80,
                    damping: 12
                  }}
                  whileHover={{ 
                    scale: 1.02,
                    rotateY: 2,
                    transition: { duration: 0.3, ease: "easeOut" }
                  }}
                >
              {/* Animation: Top-right action icons */}
              <div className="absolute top-3 right-3 flex gap-2 z-10">
                <motion.button
                  onClick={(e) => { e.stopPropagation(); handleShareTemplate(template); }}
                  className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600"
                  whileHover={{ 
                    scale: 1.2,
                    transition: { duration: 0.2 }
                  }}
                  whileTap={{ 
                    scale: 0.9,
                    transition: { duration: 0.05 }
                  }}
                >
                  <Share2 className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                </motion.button>
                {isCustom && (
                  <motion.button
                    onClick={(e) => { e.stopPropagation(); handleDeleteTemplate(template.id); }}
                    className="p-2 rounded-full bg-red-100 hover:bg-red-200 dark:bg-red-900 dark:hover:bg-red-800"
                    whileHover={{ 
                      scale: 1.2,
                      transition: { duration: 0.2 }
                    }}
                    whileTap={{ 
                      scale: 0.9,
                      transition: { duration: 0.05 }
                    }}
                  >
                    <Trash2 className="w-4 h-4 text-red-600 dark:text-red-300" />
                  </motion.button>
                )}
              </div>

              <div onClick={() => setSelectedTemplate(template)}>
                <div className="flex items-center gap-3 mb-4">
                  {/* Animation: Template emoji with enhanced hover effect */}
                  <motion.span 
                    className="text-3xl"
                    whileHover={{ 
                      scale: 1.2,
                      rotate: 10,
                      transition: { duration: 0.2 }
                    }}
                  >
                    {template.emoji}
                  </motion.span>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                      {template.name}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-full">
                        {template.category}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${getDifficultyColor(template.difficulty)}`}>
                        {template.difficulty}
                      </span>
                    </div>
                  </div>
                </div>

                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                  {template.description}
                </p>

                <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{template.estimatedTime}m</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Target className="w-4 h-4" />
                    <span>{template.daysPerWeek}/week</span>
                  </div>
                </div>
                             </div>
                </motion.div>
              </motion.div>
            );
          })}
        </motion.div>
      </motion.div>
    );
  };