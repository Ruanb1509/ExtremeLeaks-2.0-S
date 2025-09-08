const express = require('express');
const router = express.Router();

// Middleware para verificar idade
const ageVerificationMiddleware = (req, res, next) => {
  const ageConfirmed = req.headers['x-age-confirmed'] || req.session?.ageConfirmed;
  
  if (!ageConfirmed || ageConfirmed !== 'true') {
    return res.status(403).json({
      error: 'Age verification required',
      message: 'You must confirm that you are 18 years or older to access this content',
      requiresAgeVerification: true
    });
  }
  
  next();
};

// Confirmar idade
router.post('/confirm', (req, res) => {
  const { confirmed, birthDate } = req.body;
  
  if (!confirmed) {
    return res.status(400).json({ error: 'Age confirmation is required' });
  }
  
  // Verificar idade se data de nascimento foi fornecida
  if (birthDate) {
    const birth = new Date(birthDate);
    const today = new Date();
    const age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    if (age < 18) {
      return res.status(403).json({ error: 'You must be 18 years or older to access this content' });
    }
  }
  
  // Salvar confirmação na sessão (se usando sessões)
  if (req.session) {
    req.session.ageConfirmed = true;
  }
  
  res.json({
    message: 'Age confirmed successfully',
    ageConfirmed: true,
    timestamp: new Date().toISOString()
  });
});

// Verificar status da confirmação de idade
router.get('/status', (req, res) => {
  const ageConfirmed = req.headers['x-age-confirmed'] || req.session?.ageConfirmed;
  
  res.json({
    ageConfirmed: ageConfirmed === 'true' || ageConfirmed === true,
    timestamp: new Date().toISOString()
  });
});

// Revogar confirmação de idade
router.post('/revoke', (req, res) => {
  if (req.session) {
    req.session.ageConfirmed = false;
  }
  
  res.json({
    message: 'Age confirmation revoked',
    ageConfirmed: false
  });
});

module.exports = { router, ageVerificationMiddleware };