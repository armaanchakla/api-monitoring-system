import mongoose from "mongoose";
import config from "./index.js";
import logger from "./logger.js";

/**
 * MongoDB Database Manager
 */
class MongoConnection {
  constructor() {
    this.connection = null;
  }

  /**
   * Connect MongoDB
   * @returns {Promise<mongoose.Connection>}
   */
  async connect() {
    try {
      if (this.connection) {
        logger.info("Mongodb already connected");
        return this.connection;
      }

      await mongoose.connect(config.mongo.uri, {
        dbName: config.mongo.dbName,
      });

      this.connection = mongoose.connection;

      logger.info(`MongoDB connected: ${config.mongo.uri}`);

      this.connection.on("error", (err) => {
        logger.error("MongoDB connection error", err);
      });

      this.connection.on("disconnected", () => {
        logger.error("MongoDB Disconnected");
      });

      return this.connection;
    } catch (error) {
      logger.error("Failed to connect to MongoDB:", error);
      throw error;
    }
  }

  /**
   * Disconnect MongoDB
   */
  async disconnect() {
    try {
      if (this.connection) {
        await mongoose.disconnect();
        this.connection = null;
        logger.info("Mongodb disconnected!");
      }
    } catch (error) {
      logger.error("Failed to disconnect to MongoDB:", error);
      throw error;
    }
  }

  /**
   * Get Active Connection
   * @returns {mongoose.Connection}
   */
  getConnection() {
    return this.connection;
  }
}

export default new MongoConnection();
