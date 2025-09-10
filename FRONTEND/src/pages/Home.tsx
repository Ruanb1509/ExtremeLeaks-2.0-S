import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import SearchInput from '../components/ui/SearchInput';
import AgeVerificationModal from '../components/ui/AgeVerificationModal';
import Pagination from '../components/ui/pagination';
import { contentApi, ageVerificationApi } from '../services/api';
import { 
  Flame, 
  TrendingUp, 
  Clock, 
  Search, 
  Play,
  Image as ImageIcon,
  Eye,
  Calendar,
  User
} from 'lucide-react';
import type { Content, SortOption } from '../types';
import { useAuthStore } from '../store/authStore';

const ITEMS_PER_PAGE = 12;

const Home: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOption, setSortOption] = useState<SortOption>('recent');
  const [contents, setContents] = useState<Content[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [showAgeVerification, setShowAgeVerification] = useState(false);
  const { fetchUser } = useAuthStore();

  useEffect(() => {
    window.scrollTo(0, 0);
    checkAgeVerification();
  }, []);

  const checkAgeVerification = async () => {
    const ageConfirmed = sessionStorage.getItem('ageConfirmed');
    if (ageConfirmed !== 'true') {
      try {
        const status = await ageVerificationApi.getStatus();
        if (!status.ageConfirmed) {
          setShowAgeVerification(true);
          return;
        }
      } catch (error) {
        setShowAgeVerification(true);
        return;
      }
    }
    loadContents();
  };

  const loadContents = async () => {
    setIsLoading(true);
    try {
      // Simular busca de conteúdos de todos os modelos
      // Como não temos uma rota específica para isso, vamos usar uma abordagem diferente
      // Por enquanto, vamos mostrar conteúdos fictícios ou implementar uma nova rota no backend
      
      // Placeholder para demonstração
      const mockContents: Content[] = [
        {
          id: 1,
          modelId: 1,
          title: "Exclusive Photo Set",
          url: "https://mega.nz/example1",
          thumbnailUrl: "https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg",
          type: "image",
          tags: ["exclusive", "photoshoot"],
          views: 1250,
          status: "active",
          language: "en",
          isActive: true,
          createdAt: "2024-01-15T10:00:00Z",
          updatedAt: "2024-01-15T10:00:00Z",
          model: {
            id: 1,
            name: "Sophia Martinez",
            photoUrl: "https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg",
            bio: "Professional model",
            hairColor: "Brunette",
            eyeColor: "Brown",
            bodyType: "Slim",
            bustSize: "34C",
            height: 165,
            weight: 55,
            age: 25,
            birthPlace: "Miami, FL",
            ethnicity: "latina",
            orientation: "Heterosexual",
            tags: ["model", "latina"],
            views: 5000,
            slug: "sophia-martinez-abc123",
            isActive: true,
            createdAt: "2024-01-01T00:00:00Z",
            updatedAt: "2024-01-15T10:00:00Z"
          }
        },
        {
          id: 2,
          modelId: 2,
          title: "Behind the Scenes Video",
          url: "https://mega.nz/example2",
          thumbnailUrl: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg",
          type: "video",
          tags: ["behind-scenes", "exclusive"],
          views: 2100,
          status: "active",
          language: "en",
          isActive: true,
          createdAt: "2024-01-14T15:30:00Z",
          updatedAt: "2024-01-14T15:30:00Z",
          model: {
            id: 2,
            name: "Emma Johnson",
            photoUrl: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg",
            bio: "Fashion model and influencer",
            hairColor: "Blonde",
            eyeColor: "Blue",
            bodyType: "Athletic",
            bustSize: "36B",
            height: 170,
            weight: 58,
            age: 23,
            birthPlace: "Los Angeles, CA",
            ethnicity: "white",
            orientation: "Heterosexual",
            tags: ["model", "blonde"],
            views: 7500,
            slug: "emma-johnson-def456",
            isActive: true,
            createdAt: "2024-01-01T00:00:00Z",
            updatedAt: "2024-01-14T15:30:00Z"
          }
        }
      ];

      // Filtrar por busca se houver
      let filteredContents = mockContents;
      if (searchQuery) {
        filteredContents = mockContents.filter(content => 
          content.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          content.model?.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }

      // Ordenar
      switch (sortOption) {
        case 'popular':
          filteredContents.sort((a, b) => b.views - a.views);
          break;
        case 'recent':
        default:
          filteredContents.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          break;
      }

      setContents(filteredContents);
      setTotalItems(filteredContents.length);
      setTotalPages(Math.ceil(filteredContents.length / ITEMS_PER_PAGE));
    } catch (error) {
      console.error('Error loading contents:', error);
      setContents([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!showAgeVerification) {
      loadContents();
    }
  }, [currentPage, sortOption, searchQuery, showAgeVerification]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAgeVerificationConfirm = () => {
    setShowAgeVerification(false);
    loadContents();
  };

  const handleAgeVerificationExit = () => {
    window.location.href = 'https://www.google.com';
  };

  const formatViews = (views: number) => {
    return new Intl.NumberFormat('en-US', { 
      notation: 'compact',
      maximumFractionDigits: 1 
    }).format(views);
  };

  const getContentIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <Play size={20} className="text-primary-500" />;
      case 'image':
        return <ImageIcon size={20} className="text-primary-500" />;
      default:
        return <ImageIcon size={20} className="text-primary-500" />;
    }
  };

  return (
    <>
      <AgeVerificationModal
        isOpen={showAgeVerification}
        onConfirm={handleAgeVerificationConfirm}
        onExit={handleAgeVerificationExit}
      />
      
      <main>
        {/* Hero Section */}
        <section className="relative pt-20 lg:pt-28 pb-16 lg:pb-24">
          <div className="absolute inset-0 bg-gradient-to-br from-dark-400 via-dark-300 to-dark-400 z-[-1]"></div>
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-white animate-fade-in">
                Latest <span className="text-primary-500">Content</span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-300 mb-8 animate-fade-in-up">
                Discover the newest exclusive content from top models
              </p>
              <div className="flex items-center justify-center mb-8 text-gray-400 animate-fade-in-up delay-200">
                <Flame className="w-5 h-5 mr-2 text-primary-500" />
                <p>Fresh content updated daily • {totalItems} items available</p>
              </div>
              
              {/* Quick Navigation */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up delay-200">
                <Link
                  to="/models"
                  className="px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-lg transition-all duration-200 flex items-center justify-center"
                >
                  <User size={18} className="mr-2" />
                  Browse Models
                </Link>
                <Link
                  to="/premium"
                  className="px-6 py-3 bg-dark-200 hover:bg-dark-100 text-gray-300 font-medium rounded-lg transition-all duration-200 border border-dark-100"
                >
                  Go Premium
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Content Grid */}
        <section className="py-12 bg-dark-300">
          <div className="container mx-auto px-4">
            {/* Search and Controls */}
            <div className="mb-8">
              <div className="flex flex-col lg:flex-row gap-4 mb-6">
                <div className="flex-1">
                  <SearchInput
                    value={searchQuery}
                    onChange={setSearchQuery}
                    placeholder="Search content or models..."
                  />
                </div>
              </div>
              
              {/* Results Info and Sort */}
              <div className="flex flex-col sm:flex-row justify-between items-center">
                <div className="mb-4 sm:mb-0">
                  <h2 className="text-2xl font-bold text-white">
                    {searchQuery ? 'Search Results' : 'Latest'} <span className="text-primary-500">Content</span>
                  </h2>
                  {searchQuery && (
                    <p className="text-gray-400 mt-1">
                      Found {totalItems} result{totalItems !== 1 ? 's' : ''} for "{searchQuery}"
                    </p>
                  )}
                </div>
                
                <div className="flex space-x-2">
                  <button
                    onClick={() => setSortOption('recent')}
                    className={`px-4 py-2 rounded-lg flex items-center transition-all duration-200 ${
                      sortOption === 'recent'
                        ? 'bg-primary-500 text-white'
                        : 'bg-dark-200 text-gray-400 hover:bg-dark-100'
                    }`}
                  >
                    <Clock size={16} className="mr-2" />
                    Recent
                  </button>
                  <button
                    onClick={() => setSortOption('popular')}
                    className={`px-4 py-2 rounded-lg flex items-center transition-all duration-200 ${
                      sortOption === 'popular'
                        ? 'bg-primary-500 text-white'
                        : 'bg-dark-200 text-gray-400 hover:bg-dark-100'
                    }`}
                  >
                    <TrendingUp size={16} className="mr-2" />
                    Popular
                  </button>
                </div>
              </div>
            </div>
            
            {/* Content Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 min-h-[800px]">
              {isLoading ? (
                Array.from({ length: ITEMS_PER_PAGE }).map((_, index) => (
                  <div
                    key={index}
                    className="aspect-[4/5] bg-dark-200 rounded-xl animate-pulse"
                  />
                ))
              ) : contents.length > 0 ? (
                contents.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE).map((content) => (
                  <Link
                    key={content.id}
                    to={`/content/${content.id}`}
                    className="group block overflow-hidden bg-dark-200 rounded-xl shadow-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-xl"
                  >
                    <div className="relative aspect-[4/5] overflow-hidden">
                      <img 
                        src={content.thumbnailUrl || content.model?.photoUrl} 
                        alt={content.title} 
                        className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-110"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-dark-300/90"></div>
                      
                      {/* Content Type Badge */}
                      <div className="absolute top-3 left-3">
                        <div className="flex items-center px-2 py-1 bg-black/60 backdrop-blur-sm rounded-full">
                          {getContentIcon(content.type)}
                          <span className="ml-1 text-white text-xs font-medium capitalize">{content.type}</span>
                        </div>
                      </div>
                      
                      {/* Views Badge */}
                      <div className="absolute top-3 right-3">
                        <div className="flex items-center px-2 py-1 bg-black/60 backdrop-blur-sm rounded-full">
                          <Eye size={12} className="text-primary-400 mr-1" />
                          <span className="text-white text-xs font-medium">{formatViews(content.views)}</span>
                        </div>
                      </div>
                      
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <h3 className="font-bold text-lg text-white group-hover:text-primary-400 transition-colors mb-2 line-clamp-2">
                          {content.title}
                        </h3>
                        
                        {content.model && (
                          <div className="flex items-center mb-3">
                            <img 
                              src={content.model.photoUrl} 
                              alt={content.model.name}
                              className="w-6 h-6 rounded-full object-cover mr-2"
                            />
                            <span className="text-gray-300 text-sm font-medium">{content.model.name}</span>
                          </div>
                        )}
                        
                        <div className="flex items-center justify-between text-sm text-gray-300">
                          <div className="flex items-center">
                            <Calendar size={12} className="mr-1 text-primary-500" />
                            <span>{new Date(content.createdAt).toLocaleDateString()}</span>
                          </div>
                          
                          {content.tags && content.tags.length > 0 && (
                            <div className="flex items-center">
                              <span className="text-xs bg-dark-300/50 px-2 py-1 rounded">
                                {content.tags.length} tag{content.tags.length !== 1 ? 's' : ''}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="col-span-full flex flex-col items-center justify-center py-20 text-center">
                  <Search size={48} className="text-gray-600 mb-4" />
                  <p className="text-gray-400 text-xl">
                    {searchQuery 
                      ? 'No content found matching your search' 
                      : 'No content available'
                    }
                  </p>
                  {searchQuery && (
                    <button 
                      onClick={() => setSearchQuery('')}
                      className="mt-4 text-primary-500 hover:text-primary-400 transition-colors"
                    >
                      Clear search
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <Pagination 
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                className="mt-8"
              />
            )}
          </div>
        </section>
      </main>
    </>
  );
};

export default Home;