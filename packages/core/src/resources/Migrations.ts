import { BaseResource } from '@gitbeaker/requester-utils';
import { RequestHelper } from '../infrastructure';
import type {
  PaginatedRequestOptions,
  Sudo,
  ShowExpanded,
  GitlabAPIResponse,
} from '../infrastructure';

export interface MigrationEntityOptions {
  sourceFullPath: string;
  sourceType: string;
  destinationName: string;
  destinationNamespace: string;
  destinationNamespacePace?: string;
}

export interface MigrationEntityFailure {
  pipeline_class: string;
  pipeline_step: string;
  exception_class: string;
  correlation_id_value: string;
  created_at: string;
}

export interface MigrationEntitySchema extends Record<string, unknown> {
  id: number;
  bulk_import_id: number;
  status: string;
  source_full_path: string;
  destination_name: string;
  destination_namespace: string;
  parent_id?: number;
  namespace_id: number;
  project_id?: string | number;
  created_at: string;
  updated_at: string;
  failures?: MigrationEntityFailure[];
}

export interface MigrationStatusSchema extends Record<string, unknown> {
  id: number;
  status: string;
  source_type: string;
  created_at: string;
  updated_at: string;
}

export class Migrations<C extends boolean = false> extends BaseResource<C> {
  all<E extends boolean = false>(
    options?: {
      status?: 'created' | 'started' | 'finished' | 'finished';
    } & PaginatedRequestOptions<E, 'offset'>,
  ): Promise<GitlabAPIResponse<MigrationStatusSchema[], C, E, 'offset'>> {
    return RequestHelper.get<MigrationStatusSchema[]>()(this, 'bulk_imports', options);
  }

  create<E extends boolean = false>(
    configuration: { url: string; access_token: string },
    entities: MigrationEntityOptions[],
    options?: Sudo & ShowExpanded<E>,
  ): Promise<GitlabAPIResponse<MigrationStatusSchema, C, E, void>> {
    return RequestHelper.post<MigrationStatusSchema>()(this, 'bulk_imports', {
      configuration,
      entities,
      ...options,
    });
  }

  entities<E extends boolean = false>({
    bulkImportId,
    ...options
  }: {
    status?: 'created' | 'started' | 'finished' | 'finished';
    bulkImportId?: number;
  } & PaginatedRequestOptions<E, 'offset'> = {}): Promise<
    GitlabAPIResponse<MigrationEntitySchema[], C, E, 'offset'>
  > {
    const includeId = bulkImportId ? `/${bulkImportId}` : '';

    return RequestHelper.get<MigrationEntitySchema[]>()(
      this,
      `bulk_imports${includeId}/entities`,
      options,
    );
  }

  show<E extends boolean = false>(
    bulkImportId: number,
    options?: Sudo & ShowExpanded<E>,
  ): Promise<GitlabAPIResponse<MigrationStatusSchema, C, E, void>> {
    return RequestHelper.get<MigrationStatusSchema>()(
      this,
      `bulk_imports/${bulkImportId}`,
      options,
    );
  }

  showEntity<E extends boolean = false>(
    bulkImportId: number,
    entitityId: number,
    options?: Sudo & ShowExpanded<E>,
  ): Promise<GitlabAPIResponse<MigrationEntitySchema, C, E, void>> {
    return RequestHelper.get<MigrationEntitySchema>()(
      this,
      `bulk_imports/${bulkImportId}/entities/${entitityId}`,
      options,
    );
  }
}
