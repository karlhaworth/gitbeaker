import { BaseResource } from '@gitbeaker/requester-utils';
import { endpoint, RequestHelper } from '../infrastructure';
import type { Sudo, ShowExpanded, GitlabAPIResponse } from '../infrastructure';
import { UserSchema } from './Users';
import { MilestoneSchema } from '../templates/types';

export interface IssueLinkSchema extends Record<string, unknown> {
  id: number;
  iid: number;
  project_id: number;
  issue_link_id: number;
  state: string;
  description: string;
  weight?: number;
  author: Omit<UserSchema, 'created_at'>;
  milestone: MilestoneSchema;
  assignees?: Omit<UserSchema, 'created_at'>[];
  title: string;
  labels?: string[];
  user_notes_count: number;
  due_date: string;
  web_url: string;
  confidential: boolean;
  updated_at: string;
  link_created_at: string;
  link_updated_at: string;
  link_type: 'relates_to' | 'blocks' | 'is_blocked_by';
}

export interface ExpandedIssueLinkSchema extends Record<string, unknown> {
  source_issue: Omit<
    IssueLinkSchema,
    'link_type' | 'link_created_at' | 'link_updated_at' | 'issue_link_id'
  >;
  target_issue: Omit<
    IssueLinkSchema,
    'link_type' | 'link_created_at' | 'link_updated_at' | 'issue_link_id'
  >;
  link_type: 'relates_to' | 'blocks' | 'is_blocked_by';
}

export class IssueLinks<C extends boolean = false> extends BaseResource<C> {
  all<E extends boolean = false>(
    projectId: string | number,
    issueIId: number,
    options?: Sudo & ShowExpanded<E>,
  ): Promise<GitlabAPIResponse<IssueLinkSchema[], C, E, void>> {
    return RequestHelper.get<IssueLinkSchema[]>()(
      this,
      endpoint`projects/${projectId}/issues/${issueIId}/links`,
      options,
    );
  }

  create<E extends boolean = false>(
    projectId: string | number,
    issueIId: number,
    targetProjectId: string | number,
    targetIssueIId: number,
    options?: { linkType?: string } & Sudo & ShowExpanded<E>,
  ): Promise<GitlabAPIResponse<ExpandedIssueLinkSchema, C, E, void>> {
    return RequestHelper.get<ExpandedIssueLinkSchema>()(
      this,
      endpoint`projects/${projectId}/issues/${issueIId}/links`,
      {
        targetProjectId,
        targetIssueIId,
        ...options,
      },
    );
  }

  remove<E extends boolean = false>(
    projectId: string | number,
    issueIId: number,
    issueLinkId: number,
    options?: { linkType?: string } & Sudo & ShowExpanded<E>,
  ): Promise<GitlabAPIResponse<ExpandedIssueLinkSchema, C, E, void>> {
    return RequestHelper.del<ExpandedIssueLinkSchema>()(
      this,
      endpoint`projects/${projectId}/issues/${issueIId}/links/${issueLinkId}`,
      options,
    );
  }
}
