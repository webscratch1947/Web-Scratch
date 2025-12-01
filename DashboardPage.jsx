import React, { useMemo } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { WebsiteProject } from '@/types';
import Button from '@/components/ui/Button';
import * as Icons from '@/components/ui/Icons';
import { motion } from 'framer-motion';
import { useDeviceMode } from '@/hooks/useDeviceMode';
import { useNavigate } from 'react-router-dom';

const ToolCard.FC<{
  icon.ReactNode;
  title;
  description;
  to;
  colorClass;
}> = ({ icon, title, description, to, colorClass }) => {
  const navigate = useNavigate();
  return (
    <motion.div
      variants={{
        hidden: { opacity, y },
        visible: { opacity, y },
      }}
      whileHover={{ y: -5, scale.02, boxShadow: '0 0 25px rgba(123, 97, 255, 0.3)' }}
      className="bg-white/5 border border-white/[.08] p-6 rounded-2xl flex flex-col items-start h-full cursor-pointer"
      onClick={() => navigate(to)}
    >
      <div className={`p-3 bg-white/5 rounded-lg mb-4 ${colorClass}`}>{icon}</div>
      <h3 className="mb-2 text-lg font-semibold text-text-main">{title}</h3>
      <p className="text-text-secondary text-sm flex-grow">{description}</p>
      <div className="mt-4 text-sm font-semibold text-secondary hover-primary">
        Open Tool →
      </div>
    </motion.div>
  );
};

const WebsiteProjectCard.FC<{
    project;
    onEdit: (project) => void;
    onDelete: (id) => void;
}> = ({ project, onEdit, onDelete }) => (
    <div className="bg-white/5 border border-white/[.08] p-4 rounded-lg flex justify-between items-center">
        
            <p className="font-semibold text-text-main">{project.name}</p>
            <p className="text-xs text-text-secondary">Created: {new Date(project.createdAt).toLocaleDateString()}</p>
        </div>
        <div className="flex items-center space-x-2">
            <Button size="sm" variant="ghost" iconOnly onClick={() => onEdit(project)}><Icons.PencilSquareIcon className="w-5 h-5" /></Button>
            <Button size="sm" variant="ghost" iconOnly onClick={() => onDelete(project.id)}><Icons.TrashIcon className="w-5 h-5 text-error" /></Button>
        </div>
    </div>
);


const DashboardPage.FC = () => {
  const { user, websites, deleteWebsiteProject, images } = useAuth();
  const { deviceMode } = useDeviceMode();
  const navigate = useNavigate();
  const isPcMode = deviceMode === 'pc';

  const recentImages = useMemo(() => {
    return [...images]
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, isPcMode ? 5 );
  }, [images, isPcMode]);

  const tools = [
    {
      icon: <Icons.SparklesIcon className="w-8 h-8" />,
      title: 'AI Tools',
      description: 'Explore a full suite of AI-powered tools for creation and productivity.',
      to: '/dashboard/ai-tools',
      colorClass: 'text-secondary',
    },
    {
      icon: <Icons.ImagesIcon className="w-8 h-8" />,
      title: 'Image Studio',
      description: 'Create stunning, high-quality images from text prompts.',
      to: '/dashboard/image-studio',
      colorClass: 'text-primary',
    },
    {
      icon: <Icons.DocumentTextIcon className="w-8 h-8" />,
      title: 'Content Writer',
      description: 'Create high-quality articles and written content with AI.',
      to: '/dashboard/content-writer',
      colorClass: 'text-yellow-400',
    },
    {
      icon: <Icons.SpeakerWaveIcon className="w-8 h-8" />,
      title: 'Text to Voiceover',
      description: 'Generate realistic, human-like voiceovers for your content.',
      to: '/dashboard/text-to-voice',
      colorClass: 'text-tertiary',
    },
    {
      icon: <Icons.GlobeAltIcon className="w-8 h-8" />,
      title: 'Website Builder',
      description: 'Create and edit beautiful, responsive websites using AI prompts.',
      to: '/dashboard/website-builder',
      colorClass: 'text-orange-400',
    },
    {
      icon: <Icons.BookOpenIcon className="w-8 h-8" />,
      title: 'Learning Hub',
      description: 'Master new skills with interactive AI-powered coding lessons.',
      to: '/dashboard/learning-hub',
      colorClass: 'text-success',
    },
  ];

  const containerVariants = {
    hidden: { opacity },
    visible: {
      opacity,
      transition: { staggerChildren.1 },
    },
  };

  const handleEditWebsite = (project) => {
      navigate('/dashboard/website-builder', { state: { project } });
  }

  return (
    <div className="p-4 sm-6 lg-8">
      <header className="mb-12">
        <h1 className="text-4xl font-bold text-text-main text-glow">
          Welcome back, {user?.fullName?.split(' ')[0]}!
        </h1>
        <p className="text-text-secondary mt-2">What will you create today?</p>
      </header>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className={isPcMode ? "grid grid-cols-1 md-cols-2 lg-cols-3 gap-8" : "grid grid-cols-1 gap-6"}
      >
        {tools.map((tool) => (
          <ToolCard key={tool.title} {...tool} />
        ))}
      </motion.div>

      <div className="mt-16">
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-text-main">My Recent Images</h2>
            {images.length > 0 && (
                <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard/image-studio')}>
                    View All →
                </Button>
            )}
        </div>
        {recentImages.length > 0 ? (
            <div className={isPcMode ? "grid grid-cols-2 md-cols-3 lg-cols-5 gap-4" : "grid grid-cols-2 gap-4"}>
                {recentImages.map(image => (
                    <motion.div
                        key={image.id}
                        className="relative aspect-square group cursor-pointer"
                        onClick={() => navigate('/dashboard/image-studio')}
                        whileHover={{ scale.05 }}
                        transition={{ type: 'spring', stiffness }}
                    >
                        <img src={image.imageUrl} alt={image.prompt} className="w-full h-full object-cover rounded-lg" />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover-100 transition-opacity flex items-center justify-center p-2 rounded-lg">
                            <p className="text-white text-xs text-center line-clamp-3">{image.prompt}</p>
                        </div>
                    </motion.div>
                ))}
            </div>
        ) : (
            <div className="text-center py-10 bg-white/5 border border-dashed border-white/[.08] rounded-2xl">
                <Icons.ImagesIcon className="w-12 h-12 mx-auto text-text-secondary mb-2" />
                <p className="text-text-secondary">You haven't generated any images yet.</p>
                <Button variant="secondary" className="mt-4" onClick={() => navigate('/dashboard/image-studio')}>
                    Go to Image Studio
                </Button>
            </div>
        )}
      </div>

      {websites && websites.length > 0 && (
          <div className="mt-16">
              <h2 className="text-2xl font-bold text-text-main mb-4">My Websites</h2>
              <div className={isPcMode ? "grid grid-cols-1 md-cols-2 lg-cols-3 gap-4" : "grid grid-cols-1 gap-4"}>
                  {websites.map(project => (
                      <WebsiteProjectCard 
                        key={project.id} 
                        project={project} 
                        onEdit={handleEditWebsite}
                        onDelete={deleteWebsiteProject}
                      />
                  ))}
              </div>
          </div>
      )}
    </div>
  );
};

export default DashboardPage;
