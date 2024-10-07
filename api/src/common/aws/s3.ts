import {
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';
const { S3Client } = require('@aws-sdk/client-s3');

const configService = new ConfigService();

const client = () => {
  return new S3Client({
    region: configService.get('REGION_S3'),
    credentials: {
      accessKeyId: configService.get('ACCESS_KEY_S3'),
      secretAccessKey: configService.get('SECRET_ACCESS_KEY_S3'),
    },
  });
};

const createOne = (buffer, fileName) => {
  return new PutObjectCommand({
    Bucket:
      configService.get('NODE_ENV') === 'test'
        ? configService.get('BUCKET_TEST_S3')
        : configService.get('BUCKET_S3'),
    Key: fileName,
    Body: buffer,
  });
};

const getOne = (fileName) => {
  return new GetObjectCommand({
    Bucket:
      configService.get('NODE_ENV') === 'test'
        ? configService.get('BUCKET_TEST_S3')
        : configService.get('BUCKET_S3'),
    Key: fileName,
  });
};

const deleteOne = (fileName) => {
  return new DeleteObjectCommand({
    Bucket:
      configService.get('NODE_ENV') === 'test'
        ? configService.get('BUCKET_TEST_S3')
        : configService.get('BUCKET_S3'),
    Key: fileName,
  });
};

export const s3 = { client, createOne, getOne, deleteOne };
