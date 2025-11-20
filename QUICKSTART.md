# Quick Start Guide

## 1. Install Dependencies

```bash
npm install
```

## 2. Set Up Environment Variables

Create a `.env` file in the root directory with the following content:

```env
NODE_ENV=development
PORT=3000
DATABASE_URL=mongodb://localhost:27017/your-database-name
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d
JWT_COOKIE_EXPIRE=7
RATE_LIMIT_WINDOW_MS=15
RATE_LIMIT_MAX_REQUESTS=100
CORS_ORIGIN=http://localhost:3000
LOG_LEVEL=info
```

**Important:** Change `JWT_SECRET` to a strong random string in production!

## 3. Generate Prisma Client

After setting up your environment variables, generate the Prisma Client:

```bash
npx prisma generate
```

**Note:** The application includes auto-migration functionality that will automatically sync your Prisma schema with the database on startup (enabled by default in development). To control this behavior, set `PRISMA_AUTO_MIGRATE=true` or `PRISMA_AUTO_MIGRATE=false` in your `.env` file.

## 4. Start MongoDB

Make sure MongoDB is running. You can either:

- Use local MongoDB: `mongod`
- Use Docker: `docker-compose up mongo -d`
- Use MongoDB Atlas (cloud)

## 5. Run the Application

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

## 6. Test the API

Open your browser or use curl:

```bash
# Health check
curl http://localhost:3000/health

# API endpoint
curl http://localhost:3000/api/v1/
```

## Next Steps

1. Review the `README.md` for detailed documentation
2. Customize routes in `src/routes/`
3. Add your models in `src/models/`
4. Implement authentication if needed
5. Add validation using express-validator
6. Deploy using Docker or your preferred platform

## Common Issues

### Database Connection Error
- Ensure MongoDB is running
- Check `DATABASE_URL` in `.env`
- Verify MongoDB is accessible
- Run `npx prisma generate` if Prisma Client is not generated

### Port Already in Use
- Change `PORT` in `.env`
- Or kill the process using the port

### Missing Dependencies
- Run `npm install` again
- Check Node.js version (>= 18.0.0)

