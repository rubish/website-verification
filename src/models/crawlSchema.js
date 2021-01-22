import mongoose from 'mongoose';

import { WEBSITE_MODEL } from './constants.js';

const STATUS_INIT = 'INIT';
const STATUS_PROCESSING = 'PROCESSING';
const STATUS_COMPLETED = 'COMPLETED';

const crawlSchema = new mongoose.Schema(
  {
    website: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: WEBSITE_MODEL,
    },
    seedUrl: {
      type: String,
      required: true,
    },
    maxDepth: {
      type: Number,
      default: 3,
    },
    maxPages: {
      type: Number,
      default: 200,
    },
    status: {
      type: String,
      enum: [STATUS_INIT, STATUS_PROCESSING, STATUS_COMPLETED],
      required: true,
      default: STATUS_INIT,
    },
  },
  {
    timestamps: true,
  }
);

export default crawlSchema;
export { STATUS_INIT, STATUS_PROCESSING, STATUS_COMPLETED };
