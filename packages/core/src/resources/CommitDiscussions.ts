import type { BaseResourceOptions } from '@gitbeaker/requester-utils';
import { ResourceDiscussions } from '../templates';
import type {
  BaseRequestOptions,
  PaginatedRequestOptions,
  Sudo,
  ShowExpanded,
  GitlabAPIResponse,
} from '../infrastructure';
import type {
  DiscussionSchema,
  DiscussionNoteSchema,
  DiscussionNotePositionSchema,
} from '../templates/types';

export interface CommitDiscussions<C extends boolean = false> extends ResourceDiscussions<C> {
  addNote<E extends boolean = false>(
    projectId: string | number,
    commitId: number,
    discussionId: number,
    noteId: number,
    body: string,
    options?: BaseRequestOptions<E>,
  ): Promise<GitlabAPIResponse<DiscussionNoteSchema, C, E, void>>;

  all<E extends boolean = false, P extends 'keyset' | 'offset' = 'offset'>(
    projectId: string | number,
    commitId: number,
    options?: PaginatedRequestOptions<E, P>,
  ): Promise<GitlabAPIResponse<DiscussionSchema[], C, E, P>>;

  create<E extends boolean = false>(
    projectId: string | number,
    commitId: number,
    body: string,
    options: { position?: DiscussionNotePositionSchema } & BaseRequestOptions<E>,
  ): Promise<GitlabAPIResponse<DiscussionSchema, C, E, void>>;

  editNote<E extends boolean = false>(
    projectId: string | number,
    commitId: number,
    discussionId: number,
    noteId: number,
    options?: BaseRequestOptions<E> & { body?: string },
  ): Promise<GitlabAPIResponse<DiscussionNoteSchema, C, E, void>>;

  removeNote<E extends boolean = false>(
    projectId: string | number,
    commitId: number,
    discussionId: number,
    noteId: number,
    options?: Sudo & ShowExpanded<E>,
  ): Promise<GitlabAPIResponse<void, C, E, void>>;

  show<E extends boolean = false>(
    projectId: string | number,
    commitId: number,
    discussionId: number,
    options?: Sudo & ShowExpanded<E>,
  ): Promise<GitlabAPIResponse<DiscussionSchema, C, E, void>>;
}

export class CommitDiscussions<C extends boolean = false> extends ResourceDiscussions<C> {
  constructor(options: BaseResourceOptions<C>) {
    /* istanbul ignore next */
    super('projects', 'repository/commits', options);
  }
}
