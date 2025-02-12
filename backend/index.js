const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();
const bodyParser = require('body-parser');


// Import your routes
const userRoutes = require('./Routes/UserRoutes');
const GetuserRoutes = require('./Routes/getUserRoute');
const CreateUserRoute = require('./Routes/CreateUserRoute');
const settingsRoute = require('./Routes/settingsRoute');
const updateuserRoute = require('./Routes/updateuserRoute');
const taskRoutes = require('./Routes/Taskroute');
const ProductionRoute = require('./Routes/ProductionRoute');
const ProdutionScheduleUpdateRout = require('./Routes/ProdutionScheduleUpdateRout');
const ProductionScheduleCreateRoute = require('./Routes/ProductionScheduleCreateRoute');
const WorkflowRoute = require('./Routes/WorkflowRoute');
const ResourcesRoutes = require('./Routes/ResourcesRoutes');
const GarmentDefectsRoutes = require('./Routes/GarmentDefectsRoutes');
const SuppliersRoutes = require('./Routes/SuppliersRoutes');
const GetDegfectsRoutes = require('./Routes/GetDegfectsRoutes');
const GetSummaryRoutes = require('./Routes/GetSummaryRoutes');
const ResourceRequestRoute = require('./Routes/ResourceRequestRoute');
const UpdateResourceStockRoute = require('./Routes/UpdateResourceStockRoute');
const AddOrderroute = require('./Routes/AddOrderRoute');
const GetResourceCountRoute = require('./Routes/GetResourceCountRoute');
const RestePsswordRoute = require('./Routes/RestePsswordRoute');
const SetNewPasswordRoute = require('./Routes/SetNewPasswordRoute');
const VerifyCode = require('./Routes/VerifyCodeRoutes');
const GetActivityLogsRoutes = require('./Routes/GetActivityLogsRoutes');
const MessagesRoute = require('./Routes/MessagesRoute');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use('/api', userRoutes);
app.use('/api', GetuserRoutes); 
app.use('/api', CreateUserRoute); 
app.use('/api', updateuserRoute); 
app.use('/api', settingsRoute); 
app.use('/api', taskRoutes); 
app.use('/api', ProductionRoute); 
app.use('/api', ProdutionScheduleUpdateRout); 
app.use('/api', ProductionScheduleCreateRoute); 
app.use('/api', WorkflowRoute); 
app.use('/api', ResourcesRoutes); 
app.use('/api', SuppliersRoutes); 
app.use('/api', GarmentDefectsRoutes); 
app.use('/api', GetDegfectsRoutes); 
app.use('/api', GetSummaryRoutes); 
app.use('/api', ResourceRequestRoute); 
app.use('/api', UpdateResourceStockRoute); 
app.use('/api', AddOrderroute); 
app.use('/api', GetResourceCountRoute); 
app.use('/api', RestePsswordRoute); 
app.use('/api', SetNewPasswordRoute); 
app.use('/api', VerifyCode); 
app.use('/api', GetActivityLogsRoutes); 
app.use('/api', MessagesRoute); 

// Uptime route for health check
let startTime = Date.now();
app.get('/api/uptime', (req, res) => {
  const uptime = (Date.now() - startTime) / 1000; // Uptime in seconds
  res.json({ uptime });
});

// Root route
app.get('/', (req, res) => {
  res.send('Server is up and running!');
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
