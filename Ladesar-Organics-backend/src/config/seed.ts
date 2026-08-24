import Role from '../models/Role';
import User from '../models/User';
import ProductModel from '../models/Product';
import CategoryModel from '../models/Category';
import OrderModel from '../models/Order';
import CouponModel from '../models/Coupon';
import SiteSettingModel from '../models/SiteSetting';
import CustomerModel from '../models/Customer';
import { INITIAL_PRODUCTS, CATEGORIES_DATA, INITIAL_COUPONS, INITIAL_ORDERS, INITIAL_USERS, INITIAL_SITE_SETTINGS } from '../data/mockData';

export const seedDatabase = async () => {
  try {
    // 1. Ensure Roles exist
    let superAdminRole = await Role.findOne({ name: 'Super Admin' });
    if (!superAdminRole) {
      superAdminRole = await Role.create({
        name: 'Super Admin',
        permissions: [
          'View', 'Create', 'Edit', 'Delete', 'Import', 'Export',
          'Publish', 'Unpublish', 'Approve', 'Reject', 'Settings Access'
        ]
      });
      console.log('✅ Created Super Admin Role');
    }

    let inventoryRole = await Role.findOne({ name: 'Inventory Manager' });
    if (!inventoryRole) {
      inventoryRole = await Role.create({
        name: 'Inventory Manager',
        permissions: ['View', 'Create', 'Edit', 'Import', 'Export', 'Publish']
      });
      console.log('✅ Created Inventory Manager Role');
    }

    let fulfillmentRole = await Role.findOne({ name: 'Order Fulfillment' });
    if (!fulfillmentRole) {
      fulfillmentRole = await Role.create({
        name: 'Order Fulfillment',
        permissions: ['View', 'Edit', 'Export', 'Approve']
      });
      console.log('✅ Created Order Fulfillment Role');
    }

    // 2. Ensure Admin Users exist
    const adminUser = await User.findOne({ email: 'admin@ladesar.com' });
    if (!adminUser && superAdminRole) {
      await User.create({
        name: 'Vaidya R. K. Sharma',
        email: 'admin@ladesar.com',
        password: 'admin123',
        role: superAdminRole._id as any,
        isActive: true,
      });
      console.log('✅ Created Default Super Admin User (admin@ladesar.com / admin123)');
    }

    const inventoryUser = await User.findOne({ email: 'inventory@ladesar.com' });
    if (!inventoryUser && inventoryRole) {
      await User.create({
        name: 'Vikram Singh',
        email: 'inventory@ladesar.com',
        password: 'admin123',
        role: inventoryRole._id as any,
        isActive: true,
      });
      console.log('✅ Created Default Inventory User (inventory@ladesar.com / admin123)');
    }

    const ordersUser = await User.findOne({ email: 'orders@ladesar.com' });
    if (!ordersUser && fulfillmentRole) {
      await User.create({
        name: 'Ananya Deshmukh',
        email: 'orders@ladesar.com',
        password: 'admin123',
        role: fulfillmentRole._id as any,
        isActive: true,
      });
      console.log('✅ Created Default Orders Fulfillment User (orders@ladesar.com / admin123)');
    }

    // 3. Seed Mock Data if collections are empty
    const productCount = await ProductModel.countDocuments();
    if (productCount === 0) {
      await ProductModel.insertMany(INITIAL_PRODUCTS);
      console.log('✅ Seeded Products');
    }

    const categoryCount = await CategoryModel.countDocuments();
    if (categoryCount === 0) {
      await CategoryModel.insertMany(CATEGORIES_DATA);
      console.log('✅ Seeded Categories');
    }

    const customerCount = await CustomerModel.countDocuments();
    if (customerCount === 0) {
      await CustomerModel.insertMany(INITIAL_USERS);
      console.log('✅ Seeded Customer Users');
    }

    const orderCount = await OrderModel.countDocuments();
    if (orderCount === 0) {
      await OrderModel.insertMany(INITIAL_ORDERS);
      console.log('✅ Seeded Orders');
    }

    const couponCount = await CouponModel.countDocuments();
    if (couponCount === 0) {
      await CouponModel.insertMany(INITIAL_COUPONS);
      console.log('✅ Seeded Coupons');
    }

    const siteSettingCount = await SiteSettingModel.countDocuments();
    if (siteSettingCount === 0) {
      await SiteSettingModel.create(INITIAL_SITE_SETTINGS);
      console.log('✅ Seeded Site Settings');
    }

  } catch (error) {
    console.error('Error seeding default database records:', error);
  }
};
