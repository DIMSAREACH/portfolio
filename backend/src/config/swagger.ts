import path from 'path';
import swaggerJsdoc from 'swagger-jsdoc';

const routesPath = path.resolve(__dirname, '../routes/**/*.{ts,js}').replace(/\\/g, '/');

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Developer Portfolio & Content Management API',
      version: '1.0.0',
      description:
        'Production-grade RESTful API for personal portfolio website, CMS, and blog platform. Supports bilingual content (English & Khmer), authentication, media uploads, and public endpoints.',
      contact: {
        name: 'Portfolio Admin',
        email: 'admin@example.com',
      },
    },
    servers: [
      {
        url: 'http://localhost:5000/api/v1',
        description: 'Local development server',
      },
      {
        url: '/api/v1',
        description: 'Current host API server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Provide a valid JWT access token to authenticate requests.',
        },
      },
    },
    tags: [
      { name: 'Health', description: 'System health check' },
      { name: 'Auth', description: 'Authentication and user management' },
      { name: 'Admin - Categories', description: 'Category management' },
      { name: 'Admin - Projects', description: 'Project portfolio management' },
      { name: 'Admin - Skills', description: 'Skillset management' },
      { name: 'Admin - Experiences', description: 'Work and volunteer experience' },
      { name: 'Admin - Education', description: 'Education history' },
      { name: 'Admin - Certifications', description: 'Certifications and awards' },
      { name: 'Admin - Blog', description: 'Blog publishing and drafting' },
      { name: 'Admin - Messages', description: 'Contact form messages' },
      { name: 'Admin - Profile', description: 'Personal biography and profile' },
      { name: 'Admin - Social Links', description: 'Social media links' },
      { name: 'Admin - Settings', description: 'Site configuration and flags' },
      { name: 'Admin - Dashboard', description: 'Dashboard metrics and overview' },
      { name: 'Admin - Media', description: 'Media library uploads' },
      { name: 'Admin - CV', description: 'Curriculum Vitae file management' },
    ],
  },
  apis: [routesPath, './src/routes/**/*.ts', './dist/routes/**/*.js'],
};

export const swaggerSpec = swaggerJsdoc(options);
export default swaggerSpec;
