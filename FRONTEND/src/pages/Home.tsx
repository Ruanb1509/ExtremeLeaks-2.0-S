import React, { useEffect, useState } from 'react';
import ModelCard from '../components/ui/ModelCard';
import SearchInput from '../components/ui/SearchInput';
import Pagination from '../components/ui/pagination';
import { models } from '../data/models';
import { Flame, TrendingUp, Clock, Link2, ExternalLink, Search } from 'lucide-react';
import type { Model, SortOption, AdNetwork } from '../types';
import { useAuthStore } from '../store/authStore';

const ITEMS_PER_PAGE = 12;

const Home: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOption, setSortOption] = useState<SortOption>('recent');
  const [sortedModels, setSortedModels] = useState<Model[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [adNetwork, setAdNetwork] = useState<AdNetwork>('linkvertise');
  const [showAdChoice, setShowAdChoice] = useState(false);
  const [nameFilter, setNameFilter] = useState('');
      const { fetchUser } = useAuthStore();
  

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    setIsLoading(true);
  
    const timer = setTimeout(async () => {
      try {
        const allModels = await models();
        const sorted = [...allModels].sort((a, b) => {
          if (sortOption === 'recent') {
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
          }
          return b.views - a.views;
        });
        setSortedModels(sorted);
      } catch (error) {
        console.error('Erro ao buscar modelos:', error);
      } finally {
        setIsLoading(false);
      }
    }, 300);
  
    return () => clearTimeout(timer);
  }, [sortOption]);

  const filteredModels = sortedModels.filter(model => 
    model.name.toLowerCase().includes(nameFilter.toLowerCase())
  );

  const totalPages = Math.ceil(filteredModels.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const displayedModels = filteredModels.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  useEffect(() => {
    setCurrentPage(1);
  }, [nameFilter]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  console.log(fetchUser)



  return (
    <main>
      {/* Hero Section */}
      <section className="relative pt-20 lg:pt-28 pb-16 lg:pb-24">
        <div className="absolute inset-0 bg-dark-400 z-[-1]"></div>
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-white animate-fade-in">
              <span className="text-primary-500">Mega</span> Leaks
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-6 animate-fade-in-up">
              Explore the Latest Mega Leaks
            </p>
            <div className="flex items-center justify-center mb-8 text-gray-400 animate-fade-in-up delay-200">
              <Flame className="w-5 h-5 mr-2 text-primary-500" />
              <p>Discover 96 new mega packs updated daily</p>
            </div>

            {/* Ad Network Choice */}
            <div className="relative mt-6">
              <button
                onClick={() => setShowAdChoice(!showAdChoice)}
                className="bg-dark-200 hover:bg-dark-100 text-gray-300 px-4 py-2 rounded-lg flex items-center mx-auto transition-colors"
              >
                <Link2 size={16} className="mr-2 text-primary-500" />
                {adNetwork === 'linkvertise' ? 'Using Linkvertise' : 'Using AdMaven'}
                <ExternalLink size={14} className="ml-2" />
              </button>

              {/* {showAdChoice && (
                <div className="absolute left-1/2 -translate-x-1/2 mt-2 w-48 bg-dark-200 rounded-lg shadow-lg overflow-hidden z-10 animate-fade-in">
                  <button
                    onClick={() => handleAdNetworkChange('linkvertise')}
                    className={`w-full px-4 py-3 text-left transition-colors ${
                      adNetwork === 'linkvertise'
                        ? 'bg-primary-500 text-white'
                        : 'text-gray-300 hover:bg-dark-100'
                    }`}
                  >
                    Linkvertise
                  </button>
                  <button
                    onClick={() => handleAdNetworkChange('admaven')}
                    className={`w-full px-4 py-3 text-left transition-colors ${
                      adNetwork === 'admaven'
                        ? 'bg-primary-500 text-white'
                        : 'text-gray-300 hover:bg-dark-100'
                    }`}
                  >
                    AdMaven
                  </button>
                </div>
              )} */}
            </div>
          </div>
        </div>
      </section>

      {/* Models Grid */}
      <section className="py-12 bg-dark-300 flex">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-white mb-4 sm:mb-0">
              Featured <span className="text-primary-500">Models</span>
            </h2>

            <div className="mb-6 w-96">
            <SearchInput
              value={nameFilter}
              onChange={setNameFilter}
              placeholder="Search by model name..."
              className="max-w-md mx-auto"
            />
            {nameFilter && (
              <p className="text-gray-400 text-center mt-2">
                Found {filteredModels.length} result{filteredModels.length !== 1 ? 's' : ''}
              </p>
            )}
          </div>
            
            <div className="flex space-x-2 ite">
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
          

          
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 min-h-[800px]">
          {isLoading ? (
              Array.from({ length: ITEMS_PER_PAGE }).map((_, index) => (
                <div
                  key={index}
                  className="aspect-[3/4] bg-dark-200 rounded-lg animate-pulse"
                />
              ))
            ) : displayedModels.length > 0 ? (
              displayedModels.map((model) => (
                <ModelCard key={model.id} model={model} />
              ))
            ) : (
              <div className="col-span-full flex flex-col items-center justify-center py-20 text-center">
                <Search size={48} className="text-gray-600 mb-4" />
                <p className="text-gray-400 text-xl">No models found matching "{nameFilter}"</p>
                <button 
                  onClick={() => setNameFilter('')}
                  className="mt-4 text-primary-500 hover:text-primary-400 transition-colors"
                >
                  Clear search
                </button>
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
  );
};

export default Home;