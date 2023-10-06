import { protobufPackage } from './product/pb/product.pb';
import { protobufPackage as protobufProductPropertyCategoryPackage } from './product/pb/property-category.pb';
import { protobufPackage as protobufProductPropertyPackage } from './product/pb/product-property.pb';
import { protobufPackage as protobufPropertyPackage } from './product/pb/property.pb';

import { createMicroservice, getValidationPipe } from './helpers';
import {
  PRODUCT_MICROSERVICE_URL,
  PRODUCT_PROPERTY_MICROSERVICE_URL,
  PROPERTY_CATEGORY_MICROSERVICE_URL,
  PROPERTY_MICROSERVICE_URL,
} from './configs';

async function bootstrap() {
  const productsApp = await createMicroservice({
    url: PRODUCT_MICROSERVICE_URL,
    protoName: 'product.proto',
    packageName: protobufPackage,
  });
  const productsPropertyCategoriesApp = await createMicroservice({
    url: PROPERTY_CATEGORY_MICROSERVICE_URL,
    protoName: 'property-category.proto',
    packageName: protobufProductPropertyCategoryPackage,
  });
  const productsPropertyApp = await createMicroservice({
    url: PRODUCT_PROPERTY_MICROSERVICE_URL,
    protoName: 'product-property.proto',
    packageName: protobufProductPropertyPackage,
  });
  const propertyApp = await createMicroservice({
    url: PROPERTY_MICROSERVICE_URL,
    protoName: 'property.proto',
    packageName: protobufPropertyPackage,
  });

  productsApp.useGlobalPipes(getValidationPipe());
  productsPropertyCategoriesApp.useGlobalPipes(getValidationPipe());
  productsPropertyApp.useGlobalPipes(getValidationPipe());
  propertyApp.useGlobalPipes(getValidationPipe());

  await productsApp.listen();
  await productsPropertyCategoriesApp.listen();
  await productsPropertyApp.listen();
  await propertyApp.listen();
}

bootstrap();
