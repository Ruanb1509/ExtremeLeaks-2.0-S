const express = require('express');
const router = express.Router();
const slugify = require('slugify');
const crypto = require('crypto');
const { Model, Content, Report, UserHistory } = require('../models');
const { Op } = require('sequelize');
const authMiddleware = require('../Middleware/Auth');

function generateReadableSlug(name) {
  const baseSlug = slugify(name, { lower: true, strict: true });
  const hash = crypto.createHash('md5').update(name + Date.now()).digest('hex').slice(0, 6);
  return `${baseSlug}-${hash}`;
}

// Listar modelos com filtros e ordenação
router.get('/', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      ethnicity,
      language,
      tags,
      sortBy = 'recent',
      search,
      minAge,
      maxAge,
      hairColor,
      eyeColor,
      bodyType
    } = req.query;

    const offset = (page - 1) * limit;
    const where = { isActive: true };
    let order = [];

    // Filtros
    if (ethnicity) {
      where.ethnicity = ethnicity;
    }

    if (search) {
      where.name = {
        [Op.iLike]: `%${search}%`
      };
    }

    if (minAge || maxAge) {
      where.age = {};
      if (minAge) where.age[Op.gte] = parseInt(minAge);
      if (maxAge) where.age[Op.lte] = parseInt(maxAge);
    }

    if (hairColor) {
      where.hairColor = hairColor;
    }

    if (eyeColor) {
      where.eyeColor = eyeColor;
    }

    if (bodyType) {
      where.bodyType = bodyType;
    }

    if (tags) {
      const tagArray = Array.isArray(tags) ? tags : [tags];
      where.tags = {
        [Op.overlap]: tagArray
      };
    }

    // Ordenação
    switch (sortBy) {
      case 'popular':
        order = [['views', 'DESC']];
        break;
      case 'oldest':
        order = [['createdAt', 'ASC']];
        break;
      case 'random':
        order = [sequelize.fn('RANDOM')];
        break;
      case 'recent':
      default:
        order = [['createdAt', 'DESC']];
        break;
    }

    const { count, rows } = await Model.findAndCountAll({
      where,
      order,
      limit: parseInt(limit),
      offset: parseInt(offset),
      include: [{
        model: Content,
        as: 'contents',
        attributes: ['id', 'type'],
        where: { isActive: true },
        required: false
      }]
    });

    res.json({
      models: rows,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(count / limit),
        totalItems: count,
        itemsPerPage: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Erro ao buscar modelos:', error);
    res.status(500).json({ error: 'Erro ao buscar modelos', details: error.message });
  }
});

// Criar novo modelo
router.post('/', async (req, res) => {
  try {
    const modelData = {
      ...req.body,
      slug: generateReadableSlug(req.body.name),
    };

    const newModel = await Model.create(modelData);
    res.status(201).json(newModel);
  } catch (error) {
    console.error('Erro ao criar modelo:', error);
    res.status(500).json({ error: 'Erro ao criar modelo', details: error.message });
  }
});

// Detalhes do modelo
router.get('/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    const userId = req.headers.authorization ? req.user?.id : null;

    const model = await Model.findOne({
      where: { slug, isActive: true },
      include: [{
        model: Content,
        as: 'contents',
        where: { isActive: true },
        required: false,
        order: [['createdAt', 'DESC']]
      }]
    });

    if (!model) {
      return res.status(404).json({ error: 'Modelo não encontrado' });
    }

    // Incrementar visualizações
    await model.increment('views');

    // Registrar no histórico do usuário se logado
    if (userId) {
      await UserHistory.create({
        userId,
        modelId: model.id,
        action: 'view'
      });
    }

    res.json(model);
  } catch (error) {
    console.error('Erro ao buscar modelo:', error);
    res.status(500).json({ error: 'Erro ao buscar modelo', details: error.message });
  }
});

// Atualizar modelo
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const model = await Model.findByPk(id);

    if (!model) {
      return res.status(404).json({ error: 'Modelo não encontrado' });
    }

    await model.update(req.body);
    res.json(model);
  } catch (error) {
    console.error('Erro ao atualizar modelo:', error);
    res.status(500).json({ error: 'Erro ao atualizar modelo', details: error.message });
  }
});

// Deletar modelo
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const model = await Model.findByPk(id);

    if (!model) {
      return res.status(404).json({ error: 'Modelo não encontrado' });
    }

    await model.update({ isActive: false });
    res.status(204).send();
  } catch (error) {
    console.error('Erro ao deletar modelo:', error);
    res.status(500).json({ error: 'Erro ao deletar modelo', details: error.message });
  }
});

// Obter histórico do usuário
router.get('/user/history', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 20, action } = req.query;
    const offset = (page - 1) * limit;

    const where = { userId };
    if (action) {
      where.action = action;
    }

    const { count, rows } = await UserHistory.findAndCountAll({
      where,
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset),
      include: [
        {
          model: Model,
          as: 'model',
          attributes: ['id', 'name', 'photoUrl', 'slug']
        },
        {
          model: Content,
          as: 'content',
          attributes: ['id', 'title', 'thumbnailUrl', 'type']
        }
      ]
    });

    res.json({
      history: rows,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(count / limit),
        totalItems: count,
        itemsPerPage: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Erro ao buscar histórico:', error);
    res.status(500).json({ error: 'Erro ao buscar histórico', details: error.message });
  }
});

module.exports = router;