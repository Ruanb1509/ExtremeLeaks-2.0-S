import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import type { Model } from '../types';
import { linkvertise } from '../components/Linkvertise/Linkvertise';
import axios from 'axios';
import { models } from '../data/models'; // Importando a função de fetch

const ModelDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [model, setModel] = useState<Model | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchModel = async () => {
      try {
        const allModels = await models();
        const foundModel = allModels.find(m => m.slug === slug);
        
        if (foundModel) {
          setModel(foundModel);
        } else {
          navigate('/');
        }
      } catch (error) {
        console.error('Erro ao buscar modelo:', error);
        navigate('/');
      } finally {
        setLoading(false);
      }
    };
  
    fetchModel();
  }, [slug, navigate]);

  useEffect(() => {
    linkvertise("1329936", { whitelist: ["localhost"] });
  }, []);

  const handleBack = () => {
    navigate('/');
  };



    const handleDownload = async () => {
      if (model) {
        try {
          await axios.get(`${import.meta.env.VITE_BACKEND_URL}/post/${model.id}/view`);
          window.open(model.megaLink, '_blank');
        } catch (error) {
          console.error('Erro ao contar visualização:', error);
          window.open(model.megaLink, '_blank');
        }
      }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-300">
        <div className="animate-pulse text-primary-500 font-semibold text-xl">Loading...</div>
      </div>
    );
  }

  if (!model) {
    return null;
  }

  return (
    <main className="pt-20 min-h-screen bg-dark-300">
      <div className="container mx-auto px-4 py-8">
        <button
          onClick={handleBack}
          className="flex items-center text-gray-400 hover:text-primary-500 transition-colors mb-6"
        >
          <ArrowLeft size={20} className="mr-2" />
          <span>Back to Gallery</span>
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Image Section */}
          <div className="overflow-hidden rounded-lg bg-dark-200 shadow-lg">
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
