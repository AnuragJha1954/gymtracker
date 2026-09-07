import { S3Client, GetObjectCommand, PutObjectCommand, DeleteObjectCommand, ListObjectsV2Command } from '@aws-sdk/client-s3';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
const bucketName = process.env.B2_BUCKET_NAME;

const s3Client = new S3Client({
  endpoint: process.env.B2_ENDPOINT,
  region: process.env.B2_ENDPOINT ? process.env.B2_ENDPOINT.split('.')[1] : 'us-east-005', // e.g. us-east-005
  credentials: {
    accessKeyId: process.env.B2_KEY_ID,
    secretAccessKey: process.env.B2_APP_KEY
  }
});

/**
 * Converts a stream to a string
 */
const streamToString = (stream) =>
  new Promise((resolve, reject) => {
    const chunks = [];
    stream.on('data', (chunk) => chunks.push(chunk));
    stream.on('error', reject);
    stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
  });

/**
 * Reads a JSON object from Backblaze B2
 * @param {string} key - The object key (filename)
 * @returns {Promise<any>} - Returns parsed JSON, or null if not found
 */
export async function readB2Object(key) {
  try {
    const command = new GetObjectCommand({
      Bucket: bucketName,
      Key: key
    });
    const response = await s3Client.send(command);
    const bodyContents = await streamToString(response.Body);
    return JSON.parse(bodyContents);
  } catch (error) {
    if (error.name === 'NoSuchKey' || error.$metadata?.httpStatusCode === 404) {
      return null;
    }
    console.error(`Error reading ${key} from B2:`, error);
    throw error;
  }
}

/**
 * Writes a JSON object to Backblaze B2
 * @param {string} key - The object key (filename)
 * @param {any} data - The data to store (will be JSON.stringified)
 */
export async function writeB2Object(key, data) {
  try {
    const jsonString = JSON.stringify(data, null, 2);
    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
      Body: jsonString,
      ContentType: 'application/json'
    });
    await s3Client.send(command);
    return true;
  } catch (error) {
    console.error(`Error writing ${key} to B2:`, error);
    throw error;
  }
}

/**
 * Deletes an object from Backblaze B2
 * @param {string} key - The object key (filename) to delete
 */
export async function deleteB2Object(key) {
  try {
    const command = new DeleteObjectCommand({
      Bucket: bucketName,
      Key: key
    });
    await s3Client.send(command);
    return true;
  } catch (error) {
    console.error(`Error deleting ${key} from B2:`, error);
    throw error;
  }
}

/**
 * Lists all objects in the bucket
 * @returns {Promise<Array>} - Returns an array of object keys
 */
export async function listB2Objects() {
  try {
    const command = new ListObjectsV2Command({
      Bucket: bucketName
    });
    const response = await s3Client.send(command);
    return (response.Contents || []).map(item => item.Key);
  } catch (error) {
    console.error(`Error listing B2 objects:`, error);
    return [];
  }
}
