import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import ReportModal from '../components/ui/ReportModal';
import { 
  ArrowLeft, 
  ExternalLink, 
  Share2, 
  MoreVertical, 
  Eye, 
  Calendar,
  MapPin,
  Ruler,
  Weight,
  Palette,
  User,
  Heart,
  Flag,
  ChevronDown,
  Play,
  Image as ImageIcon
} from 'lucide-react';
import type { Model, Content } from '../types';
import { linkvertise } from '../components/Linkvertise/Linkvertise';
import { modelsApi, contentApi } from '../services/api';
import { useAuthStore } from '../store/authStore';

const ModelDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [model, setModel] = useState<Model | null>(null);
  const [contents, setContents] = useState<Content[]>([]);
  const [loading, setLoading] = useState(true);
  const [showMore, setShowMore] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [contentLoading, setContentLoading] = useState(false);
  const { user } = useAuthStore();

  useEffect(() => {
    const fetchModelData = async () => {
      try {
        const modelData = await modelsApi.getBySlug(slug!);
        setModel(modelData);
        
        // Load model contents
        setContentLoading(true);
        const contentData = await contentApi.getByModel(modelData.id, { limit: 20 });
        setContents(contentData.contents || []);
      } catch (error) {
        console.error('Error loading model:', error);
        navigate('/');
      } finally {
        setLoading(false);
        setContentLoading(false);
      }
    };
  
    if (slug) {
      fetchModelData();
    }
  }, [slug, navigate]);

  useEffect(() => {
    if (!user?.isPremium && !user?.isAdmin) {
      linkvertise("1329936", { whitelist: ["extreme-leaks.vercel.app"] });
    }
  }, [user]);

  const handleBack = () => {
    navigate('/');
  };

  const handleContentClick = async (content: Content) => {
    try {
      await contentApi.recordView(content.id);
      window.open(content.url, '_blank');
    } catch (error) {
      console.error('Error recording view:', error);
      window.open(content.url, '_blank');
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: model?.name,
      text: `Check out ${model?.name} on our platform`,
      url: window.location.href
    };

    if (navigator.share && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        console.log('Share cancelled');
      }
    } else {
      // Fallback to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
    setShowDropdown(false);
  };

  const formatViews = (views: number) => {
    return new Intl.NumberFormat('en-US', { 
      notation: 'compact',
      maximumFractionDigits: 1 
    }).format(views);
  };

  const getEthnicityLabel = (ethnicity?: string) => {
    const labels = {
      arab: 'Arab',
      asian: 'Asian',
      ebony: 'Ebony',
      indian: 'Indian',
      latina: 'Latina',
      white: 'White'
    };
    return ethnicity ? labels[ethnicity as keyof typeof labels] : 'Not specified';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-300">
        <div className="animate-pulse text-primary-500 font-semibold text-xl">Loading model...</div>
      </div>
    );
  }

  if (!model) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-300">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Model not found</h2>
          <Button onClick={handleBack}>Return to Gallery</Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <main className="pt-20 min-h-screen bg-dark-300">
      <div className="container mx-auto px-4 py-8">
        <button
          onClick={handleBack}
          className="flex items-center text-gray-400 hover:text-primary-500 transition-colors mb-6"
        >
          <ArrowLeft size={20} className="mr-2" />
          <span>Back to Gallery</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Image Section */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <div className="overflow-hidden rounded-lg bg-dark-200 shadow-lg relative">
                <img
                  src={model.photoUrl}
                  alt={model.name}
                  className="w-full h-auto object-cover"
                />
                
                {/* Action Buttons Overlay */}
                <div className="absolute top-4 right-4 flex space-x-2">
                  <div className="relative">
                    <button
                      onClick={() => setShowDropdown(!showDropdown)}
                      className="bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
                    >
                      <MoreVertical size={18} />
                    </button>
                    
                    {showDropdown && (
                      <div className="absolute right-0 mt-2 w-48 bg-dark-200 rounded-lg shadow-lg overflow-hidden z-10">
                        <button
                          onClick={handleShare}
                          className="w-full px-4 py-3 text-left text-gray-300 hover:bg-dark-100 flex items-center"
                        >
                          <Share2 size={16} className="mr-2" />
                          Share Profile
                        </button>
                        <button
                          onClick={() => {
                            setShowReportModal(true);
                            setShowDropdown(false);
                          }}
                          className="w-full px-4 py-3 text-left text-gray-300 hover:bg-dark-100 flex items-center"
                        >
                          <Flag size={16} className="mr-2" />
                          Report Model
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Stats Overlay */}
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="bg-black/50 backdrop-blur-sm rounded-lg p-3">
                    <div className="flex items-center justify-between text-white">
                      <div className="flex items-center">
                        <Eye size={16} className="mr-2 text-primary-500" />
                        <span className="font-medium">{formatViews(model.views)} views</span>
                      </div>
                      {model.ethnicity && (
                        <span className="px-2 py-1 bg-primary-500/80 text-xs font-medium rounded-full">
                          {getEthnicityLabel(model.ethnicity)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Info Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header */}
            <div className="bg-dark-200 rounded-lg shadow-lg p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-white mb-2">
                    {model.name}
                  </h1>
                  <div className="flex items-center space-x-4 text-sm text-gray-400">
                    <span>Added {new Date(model.createdAt).toLocaleDateString()}</span>
                    {model.tags && model.tags.length > 0 && (
                      <span>{model.tags.length} tags</span>
                    )}
                  </div>
                </div>
              </div>

              {model.bio && (
                <div className="mb-6">
                  <div className="h-0.5 w-16 bg-primary-500 mb-4"></div>
                  <p className="text-gray-300 leading-relaxed">
                    {model.bio}
                  </p>
                </div>
              )}

              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {model.age && (
                  <div className="text-center p-3 bg-dark-300 rounded-lg">
                    <Calendar size={20} className="mx-auto mb-1 text-primary-500" />
                    <div className="text-white font-medium">{model.age}</div>
                    <div className="text-xs text-gray-400">Years Old</div>
                  </div>
                )}
                
                {model.height && (
                  <div className="text-center p-3 bg-dark-300 rounded-lg">
                    <Ruler size={20} className="mx-auto mb-1 text-primary-500" />
                    <div className="text-white font-medium">{model.height}cm</div>
                    <div className="text-xs text-gray-400">Height</div>
                  </div>
                )}
                
                {model.weight && (
                  <div className="text-center p-3 bg-dark-300 rounded-lg">
                    <Weight size={20} className="mx-auto mb-1 text-primary-500" />
                    <div className="text-white font-medium">{model.weight}kg</div>
                    <div className="text-xs text-gray-400">Weight</div>
                  </div>
                )}
                
                <div className="text-center p-3 bg-dark-300 rounded-lg">
                  <Eye size={20} className="mx-auto mb-1 text-primary-500" />
                  <div className="text-white font-medium">{formatViews(model.views)}</div>
                  <div className="text-xs text-gray-400">Views</div>
                </div>
              </div>
            </div>

            {/* Detailed Info */}
            <div className="bg-dark-200 rounded-lg shadow-lg p-6">
              <button
                onClick={() => setShowMore(!showMore)}
                className="flex items-center justify-between w-full text-left mb-4"
              >
                <h3 className="text-xl font-semibold text-white">Model Details</h3>
                <ChevronDown 
                  size={20} 
                  className={`text-gray-400 transition-transform ${showMore ? 'rotate-180' : ''}`}
                />
              </button>
              
              {showMore && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    {model.birthPlace && (
                      <div className="flex items-center">
                        <MapPin size={16} className="mr-3 text-primary-500 flex-shrink-0" />
                        <div>
                          <div className="text-sm text-gray-400">Birth Place</div>
                          <div className="text-white">{model.birthPlace}</div>
                        </div>
                      </div>
                    )}
                    
                    {model.ethnicity && (
                      <div className="flex items-center">
                        <User size={16} className="mr-3 text-primary-500 flex-shrink-0" />
                        <div>
                          <div className="text-sm text-gray-400">Ethnicity</div>
                          <div className="text-white">{getEthnicityLabel(model.ethnicity)}</div>
                        </div>
                      </div>
                    )}
                    
                    {model.orientation && (
                      <div className="flex items-center">
                        <Heart size={16} className="mr-3 text-primary-500 flex-shrink-0" />
                        <div>
                          <div className="text-sm text-gray-400">Orientation</div>
                          <div className="text-white">{model.orientation}</div>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-4">
                    {model.hairColor && (
                      <div className="flex items-center">
                        <Palette size={16} className="mr-3 text-primary-500 flex-shrink-0" />
                        <div>
                          <div className="text-sm text-gray-400">Hair Color</div>
                          <div className="text-white">{model.hairColor}</div>
                        </div>
                      </div>
                    )}
                    
                    {model.eyeColor && (
                      <div className="flex items-center">
                        <Eye size={16} className="mr-3 text-primary-500 flex-shrink-0" />
                        <div>
                          <div className="text-sm text-gray-400">Eye Color</div>
                          <div className="text-white">{model.eyeColor}</div>
                        </div>
                      </div>
                    )}
                    
                    {model.bodyType && (
                      <div className="flex items-center">
                        <User size={16} className="mr-3 text-primary-500 flex-shrink-0" />
                        <div>
                          <div className="text-sm text-gray-400">Body Type</div>
                          <div className="text-white">{model.bodyType}</div>
                        </div>
                      </div>
                    )}
                    
                    {model.bustSize && (
                      <div className="flex items-center">
                        <Ruler size={16} className="mr-3 text-primary-500 flex-shrink-0" />
                        <div>
                          <div className="text-sm text-gray-400">Bust Size</div>
                          <div className="text-white">{model.bustSize}</div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              {/* Tags */}
              {model.tags && model.tags.length > 0 && (
                <div className="mt-6 pt-6 border-t border-dark-100">
                  <h4 className="text-sm font-medium text-gray-400 mb-3">Tags</h4>
                  <div className="flex flex-wrap gap-2">
                    {model.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-dark-300 text-gray-300 text-sm rounded-full hover:bg-primary-500/20 hover:text-primary-400 transition-colors cursor-pointer"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Content Section */}
            <div className="bg-dark-200 rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-semibold text-white mb-4">
                Content ({contents.length})
              </h3>
              
              {contentLoading ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {Array.from({ length: 6 }).map((_, index) => (
                    <div key={index} className="aspect-video bg-dark-300 rounded-lg animate-pulse" />
                  ))}
                </div>
              ) : contents.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {contents.map((content) => (
                    <div
                      key={content.id}
                      onClick={() => handleContentClick(content)}
                      className="group relative aspect-video bg-dark-300 rounded-lg overflow-hidden cursor-pointer hover:scale-105 transition-transform"
                    >
                      {content.thumbnailUrl ? (
                        <img
                          src={content.thumbnailUrl}
                          alt={content.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          {content.type === 'video' ? (
                            <Play size={32} className="text-gray-500" />
                          ) : (
                            <ImageIcon size={32} className="text-gray-500" />
                          )}
                        </div>
                      )}
                      
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <ExternalLink size={24} className="text-white" />
                      </div>
                      
                      <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/80 to-transparent">
                        <h4 className="text-white text-sm font-medium truncate">{content.title}</h4>
                        <div className="flex items-center justify-between text-xs text-gray-300 mt-1">
                          <span className="flex items-center">
                            <Eye size={12} className="mr-1" />
                            {formatViews(content.views)}
                          </span>
                          <span className="capitalize">{content.type}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-400">
                  <ImageIcon size={48} className="mx-auto mb-4 opacity-50" />
                  <p>No content available for this model yet.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>

    <ReportModal
      isOpen={showReportModal}
      onClose={() => setShowReportModal(false)}
      modelId={model?.id}
      title={model?.name || 'Model'}
    />
    </>
  );
};

export default ModelDetail;
            <img
              src={model.imageUrl}
              alt={model.name}
              className="w-full h-auto object-cover"
            />
          </div>

          {/* Info Section */}
          <div className="bg-dark-200 rounded-lg shadow-lg p-6">
            <h1 className="text-3xl font-bold mb-4 text-white">
              {model.name}
            </h1>

            <div className="mb-8">
              <div className="h-0.5 w-16 bg-primary-500 mb-4"></div>
              <p className="text-gray-300 leading-relaxed">
                {model.description}
              </p>
            </div>

            <div className="space-y-4">
              <div className="bg-dark-300 p-4 rounded-lg border border-dark-100">
                <p className="text-gray-400 text-sm mb-2">To access this content:</p>
                <p className="text-white font-medium">Click the button below to visit the Mega link</p>
              </div>

                <Button
                  variant="primary"
                  size="lg"
                  fullWidth
                  onClick={handleDownload}
                  className="group"
                >
                  <span className="flex items-center justify-center">
                    Mega Link
                    <ExternalLink size={18} className="ml-2 transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                </Button>

              <p className="text-xs text-gray-500 text-center mt-2">
                By accessing this content, you confirm you are 18+ and accept our terms.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ModelDetail;
