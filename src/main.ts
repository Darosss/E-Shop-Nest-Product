import { protobufPackage } from './product/pb/product.pb';
import { protobufPackage as protobufProductPropertyCategoryPackage } from './product/pb/property-category.pb';
import { protobufPackage as protobufProductPropertyPackage } from './product/pb/product-property.pb';
import { protobufPackage as protobufPropertyPackage } from './product/pb/property.pb';

import { createMicroservice, getValidationPipe } from './helpers';

async function bootstrap() {
  const productsApp = await createMicroservice({
    url: '0.0.0.0:50100',
    protoName: 'product.proto',
    packageName: protobufPackage,
  });

  const productsPropertyCategoriesApp = await createMicroservice({
    url: '0.0.0.0:50101',
    protoName: 'property-category.proto',
    packageName: protobufProductPropertyCategoryPackage,
  });
  const productsPropertyApp = await createMicroservice({
    url: '0.0.0.0:50102',
    protoName: 'product-property.proto',
    packageName: protobufProductPropertyPackage,
  });
  const propertyApp = await createMicroservice({
    url: '0.0.0.0:50103',
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
