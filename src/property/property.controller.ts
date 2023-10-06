import { Controller, Inject } from '@nestjs/common';
import { PropertyService } from './property.service';
import {
  FindAllPropertyResponse,
  FindOnePropertyResponse,
  PROPERTY_SERVICE_NAME,
  PropertyOperationResponse,
} from 'src/product/pb/property.pb';
import { GrpcMethod } from '@nestjs/microservices';
import {
  CreatePropertyDto,
  FindOnePropertyRequestDto,
  UpdatePropertyDto,
} from './dto/property.dto';

@Controller()
export class PropertyController {
  @Inject(PropertyService)
  private readonly propertyCategoriesService: PropertyService;

  @GrpcMethod(PROPERTY_SERVICE_NAME, 'Create')
  private createProperty(
    payload: CreatePropertyDto,
  ): Promise<PropertyOperationResponse> {
    return this.propertyCategoriesService.create(payload);
  }

  @GrpcMethod(PROPERTY_SERVICE_NAME, 'FindOne')
  private findOneProperty(
    payload: FindOnePropertyRequestDto,
  ): Promise<FindOnePropertyResponse> {
    return this.propertyCategoriesService.findOne(payload);
  }

  @GrpcMethod(PROPERTY_SERVICE_NAME, 'Update')
  private updateProperty(
    payload: UpdatePropertyDto,
  ): Promise<PropertyOperationResponse> {
    return this.propertyCategoriesService.updateOne(payload);
  }

  @GrpcMethod(PROPERTY_SERVICE_NAME, 'FindAll')
  private findAllProperties(): Promise<FindAllPropertyResponse> {
    return this.propertyCategoriesService.findAll();
  }
}
