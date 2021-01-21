import mongoose from 'mongoose';

import { CRAWL_URL_MODEL } from './constants.js';

const crawlUrlContentSchema = new mongoose.Schema(
  {
    crawlUrl: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: CRAWL_URL_MODEL,
    },
    html: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default crawlUrlContentSchema;
