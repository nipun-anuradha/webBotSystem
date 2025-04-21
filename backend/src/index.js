import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import whatsapp from './service/KD_WhatsAppClient_Service.js';
import sequelize from './db/KD_DBConnection.js';
import Admin from './model/KD_AdminModel.js';
import { Op, Sequelize } from 'sequelize';
import adminRoutes from './routes/KD_adminRoutes.js';
import Service from './model/KD_ServiceModel.js';

const app = express();
const PORT = 3010;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

// Middleware
app.use(cors());
app.use(express.json());

app.use('/api/admin', adminRoutes);

app.use((req, res) => {
    res.status(404).send('Route not found');
});
app.use((err, req, res, next) => {
    console.error('Global error handler:', err.stack);
    res.status(500).send('Something went wrong!');
});

class App {
    constructor() {
        this.app = app;
        this.port = PORT;
        app.locals.appInstance = this;
    }

    async initializeDatabase() {
        try {
            await sequelize.authenticate();
            console.log('Database connection has been established successfully.');
            await sequelize.sync({ alter: true });
            console.log('Database synchronized successfully.');
        } catch (error) {
            console.error('Error during database initialization:', error);
            throw error;
        }
    }

    async initializeAdmin() {
        try {
            const adminExists = await Admin.findOne({ where: { username: 'admin' } });
            if (!adminExists) {
                await Admin.create({
                    username: 'admin',
                    password: '1234', // Will be automatically hashed
                    role: 'admin'
                });
                console.log('Default admin user created');
            }
        } catch (error) {
            console.error('Error creating admin user:', error);
            throw error;
        }
    }

    async initializeService() {
        try {
            const services = [
                {
                    service_name_sinhala: 'නඩත්තු කිරීම සඳහා ලබාදී ඇති උපකරණයේ තත්වය පිරික්සීම',
                    service_name_english: 'Check the status of equipment provided for maintenance',
                },
                {
                    service_name_sinhala: 'තාක්ෂණික ශිල්පියා සම්බන්ධ කරගැනීම',
                    service_name_english: 'Contact the technician',
                },
                {
                    service_name_sinhala: 'සිවිලිම් පොටෝ සාම්පල බැලීම',
                    service_name_english: 'To view ceiling photo samples',
                }
            ];
    
            for (const service of services) {
                const exists = await Service.findOne({ where: { service_name_english: service.service_name_english } });
                if (!exists) {
                    await Service.create(service);
                    console.log(`Service added: ${service.service_name_english}`);
                }
            }
        } catch (error) {
            console.error('Error initializing service:', error);
            throw error;
        }
    }
    


    async startServer() {
        try {
            await this.initializeDatabase();
            await whatsapp.initialize();
            await this.initializeAdmin();
            await this.initializeService();

            // this.app.listen(this.port,'192.168.1.10', () => {
            this.app.listen(this.port,() => {
                console.log(`Server is running on port ${this.port}`);
            });

        } catch (error) {
            console.error('Error during startup:', error);
            process.exit(1);
        }
    }
}

const appInstance = new App();
(async () => {
    try {
        await appInstance.startServer();
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
})();
