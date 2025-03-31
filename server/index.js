const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const crypto = require('crypto');

// Square credentials
const SQUARE_APP_ID = 'sq0idp-IphWfeDCMSuvipWKjL4yew';
const SQUARE_ACCESS_TOKEN = 'EAAAl6Ag1yPJaguFK2svch66Uw0nWLvEsCJCzGEXYkl41QfP-CZp52iNEN2lwX5r';
const SQUARE_WEBHOOK_SIGNATURE_KEY = 'Loh20skWSgn9uan7EfKoGw';

// Create Express app
const app = express();

// Create HTTP server using Express app
const server = http.createServer(app);

// Create Socket.IO server
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", "http://localhost:3000"],
    methods: ["GET", "POST"]
  }
});

// Enable CORS for all routes
app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:3000"]
}));

// Parse JSON bodies with raw body for signature verification
app.use(express.json({
  verify: (req, res, buf) => {
    req.rawBody = buf;
  }
}));

// Store orders in memory
let orders = new Map();

// Verify Square webhook signature
function verifySquareSignature(req) {
  const signatureHeader = req.get('x-square-signature');
  if (!signatureHeader) {
    throw new Error('No signature header');
  }

  const hmac = crypto.createHmac('sha256', SQUARE_WEBHOOK_SIGNATURE_KEY);
  hmac.update(req.rawBody);
  const hash = hmac.digest('base64');

  if (hash !== signatureHeader) {
    throw new Error('Invalid signature');
  }
  return true;
}

// Transform Square order data into frontend format
function transformSquareOrder(webhookData) {
  if (!webhookData?.data?.object?.order) {
    throw new Error('Invalid order data structure');
  }

  const squareOrder = webhookData.data.object.order;
  
  return {
    id: squareOrder.id,
    customerName: squareOrder.customer_id || 'New Order',
    items: squareOrder.line_items.map(item => ({
      name: item.name,
      quantity: parseInt(item.quantity),
      variant: item.modifiers?.[0]?.name || 'Regular'
    })),
    timestamp: Date.now(),
    completed: false,
    completedAt: undefined,
    finalElapsedTime: undefined
  };
}

// Webhook endpoint for Square
app.post('/webhook', (req, res) => {
  try {
    // Verify the webhook signature
    verifySquareSignature(req);
    
    console.log('Received webhook:', JSON.stringify(req.body, null, 2));

    // Process both created and updated events
    if (!['order.created', 'order.updated'].includes(req.body.type)) {
      return res.status(200).json({ message: 'Ignored non-order event' });
    }

    const orderData = transformSquareOrder(req.body);
    
    // Only store/update if not completed
    if (!orderData.completed) {
      // Store order in memory
      orders.set(orderData.id, orderData);
      
      // Emit to all connected clients
      io.emit('new_order', orderData);
      console.log('Emitted new order:', orderData);
    }

    res.status(200).json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error.message);
    res.status(error.message.includes('signature') ? 401 : 500)
       .json({ error: error.message });
  }
});

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('Client connected');
  
  // Send existing orders to newly connected client
  socket.emit('initial_orders', Array.from(orders.values()));
  
  // Handle order completion from frontend
  socket.on('complete_order', (orderId) => {
    console.log('Completing order:', orderId);
    orders.delete(orderId);
    io.emit('order_completed', orderId);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// Test endpoint
app.get('/', (req, res) => {
  res.json({ 
    status: 'Server is running',
    ordersCount: orders.size,
    webhookUrl: 'https://0dfd-2603-3005-36bf-c000-812f-7449-b06c-12e2.ngrok-free.app/webhook'
  });
});

// Test endpoint for simulating orders
app.post('/test-order', (req, res) => {
  const testOrder = {
    id: Date.now().toString(),
    customerName: 'Test Customer',
    items: [
      { name: 'Test Item', quantity: 1, variant: 'Regular' }
    ],
    timestamp: Date.now(),
    completed: false,
    completedAt: undefined,
    finalElapsedTime: undefined
  };
  
  // Store order in memory
  orders.set(testOrder.id, testOrder);
  
  // Emit to all connected clients
  io.emit('new_order', testOrder);
  console.log('Emitted test order:', testOrder);

  res.json({ success: true, order: testOrder });
});

// Start the server
const PORT = 4000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Local test URL: http://localhost:${PORT}`);
  console.log(`Webhook URL (ngrok): https://0dfd-2603-3005-36bf-c000-812f-7449-b06c-12e2.ngrok-free.app/webhook`);
}); 