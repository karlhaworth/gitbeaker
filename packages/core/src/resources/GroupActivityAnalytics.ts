import { BaseResource } from '@gitbeaker/requester-utils';
import { RequestHelper } from '../infrastructure';
import type { Sudo, ShowExpanded, GitlabAPIResponse } from '../infrastructure';

export interface GroupAnalyticsIssuesCountSchema extends Record<string, unknown> {
  issues_count: number;
}

export interface GroupAnalyticsMRsCountSchema extends Record<string, unknown> {
  merge_requests_count: number;
}

export interface GroupAnalyticsNewMembersCountSchema extends Record<string, unknown> {
  new_members_count: number;
}

export class GeoNodes<C extends boolean = false> extends BaseResource<C> {
  issuesCount<E extends boolean = false>(
    groupPath: string,
    options?: Sudo & ShowExpanded<E>,
  ): Promise<GitlabAPIResponse<GroupAnalyticsIssuesCountSchema, C, E, void>> {
    return RequestHelper.get<GroupAnalyticsIssuesCountSchema>()(
      this,
      'analytics/group_activity/issues_count',
      {
        query: {
          groupPath,
        },
        ...options,
      },
    );
  }

  mergeRequestsCount<E extends boolean = false>(
    groupPath: string,
    options?: Sudo & ShowExpanded<E>,
  ): Promise<GitlabAPIResponse<GroupAnalyticsMRsCountSchema, C, E, void>> {
    return RequestHelper.get<GroupAnalyticsMRsCountSchema>()(
      this,
      'analytics/group_activity/merge_requests_count',
      {
        query: {
          groupPath,
        },
        ...options,
      },
    );
  }

  newMembersCount<E extends boolean = false>(
    groupPath: string,
    options?: Sudo & ShowExpanded<E>,
  ): Promise<GitlabAPIResponse<GroupAnalyticsNewMembersCountSchema, C, E, void>> {
    return RequestHelper.get<GroupAnalyticsNewMembersCountSchema>()(
      this,
      'analytics/group_activity/new_members_count',
      {
        query: {
          groupPath,
        },
        ...options,
      },
    );
  }
}
