import type { BaseResourceOptions } from '@gitbeaker/requester-utils';
import { ResourceMembers } from '../templates';
import type {
  SimpleMemberSchema,
  CondensedMemberSchema,
  MemberSchema,
  IncludeInherited,
  AccessLevel,
} from '../templates/types';
import { endpoint, RequestHelper } from '../infrastructure';
import type {
  BaseRequestOptions,
  PaginatedRequestOptions,
  Sudo,
  ShowExpanded,
  GitlabAPIResponse,
} from '../infrastructure';

export interface BillableGroupMemberSchema extends CondensedMemberSchema {
  last_activity_on: string;
  membership_type: string;
  removable: boolean;
  created_at: string;
}

export interface BillableGroupMemberMembershipSchema extends Record<string, unknown> {
  id: number;
  source_id: number;
  source_full_name: string;
  source_members_url: string;
  created_at: string;
  expires_at: string;
  access_level: {
    string_value: string;
    integer_value: AccessLevel;
  };
}

export interface OverrodeGroupMemberSchema extends SimpleMemberSchema {
  override: boolean;
}

export interface GroupMembers<C extends boolean = false> extends ResourceMembers<C> {
  add<E extends boolean = false>(
    projectId: string | number,
    userId: number,
    accessLevel: AccessLevel,
    options?: BaseRequestOptions<E>,
  ): Promise<GitlabAPIResponse<MemberSchema, C, E, void>>;

  all<E extends boolean = false, P extends 'keyset' | 'offset' = 'offset'>(
    projectId: string | number,
    options: IncludeInherited & PaginatedRequestOptions<E, P>,
  ): Promise<GitlabAPIResponse<MemberSchema[], C, E, P>>;

  edit<E extends boolean = false>(
    projectId: string | number,
    userId: number,
    accessLevel: AccessLevel,
    options?: BaseRequestOptions<E>,
  ): Promise<GitlabAPIResponse<MemberSchema, C, E, void>>;

  show<E extends boolean = false>(
    projectId: string | number,
    userId: number,
    options?: IncludeInherited & Sudo & ShowExpanded<E>,
  ): Promise<GitlabAPIResponse<MemberSchema, C, E, void>>;

  remove<E extends boolean = false>(
    projectId: string | number,
    userId: number,
    options?: Sudo & ShowExpanded<E>,
  ): Promise<GitlabAPIResponse<void, C, E, void>>;
}

export class GroupMembers<C extends boolean = false> extends ResourceMembers<C> {
  constructor(options: BaseResourceOptions<C>) {
    /* istanbul ignore next */
    super('groups', options);
  }

  allBillable<E extends boolean = false, P extends 'keyset' | 'offset' = 'offset'>(
    groupId: string | number,
    options: PaginatedRequestOptions<E, P>,
  ): Promise<GitlabAPIResponse<BillableGroupMemberSchema[], C, E, P>> {
    return RequestHelper.get<BillableGroupMemberSchema[]>()(
      this,
      endpoint`${groupId}/billable_members`,
      options,
    );
  }

  approve<E extends boolean = false>(
    groupId: string | number,
    userId: number,
    options: Sudo & ShowExpanded<E>,
  ): Promise<GitlabAPIResponse<MemberSchema, C, E, void>> {
    return RequestHelper.put<MemberSchema>()(
      this,
      endpoint`${groupId}/members/${userId}/approve`,
      options,
    );
  }

  approveAll<E extends boolean = false>(
    groupId: string | number,
    options: Sudo & ShowExpanded<E>,
  ): Promise<GitlabAPIResponse<MemberSchema[], C, E, void>> {
    return RequestHelper.put<MemberSchema[]>()(
      this,
      endpoint`${groupId}/members/approve_all`,
      options,
    );
  }

  removeBillable<E extends boolean = false>(
    groupId: string | number,
    userId: number,
    options?: Sudo & ShowExpanded<E>,
  ): Promise<GitlabAPIResponse<void, C, E, void>> {
    return RequestHelper.del()(this, endpoint`${groupId}/billable_members/${userId}`, options);
  }

  removeOverrideFlag<E extends boolean = false>(
    groupId: string | number,
    userId: number,
    options: Sudo & ShowExpanded<E>,
  ): Promise<GitlabAPIResponse<OverrodeGroupMemberSchema, C, E, void>> {
    return RequestHelper.del<OverrodeGroupMemberSchema>()(
      this,
      endpoint`${groupId}/members/${userId}/override`,
      options,
    );
  }

  setOverrideFlag<E extends boolean = false>(
    groupId: string | number,
    userId: number,
    options: Sudo & ShowExpanded<E>,
  ): Promise<GitlabAPIResponse<OverrodeGroupMemberSchema, C, E, void>> {
    return RequestHelper.put<OverrodeGroupMemberSchema>()(
      this,
      endpoint`${groupId}/members/${userId}/override`,
      options,
    );
  }

  showBillableMemberships<E extends boolean = false>(
    groupId: string | number,
    userId: number,
    options: Sudo & ShowExpanded<E>,
  ): Promise<GitlabAPIResponse<BillableGroupMemberMembershipSchema, C, E, void>> {
    return RequestHelper.get<BillableGroupMemberMembershipSchema>()(
      this,
      endpoint`${groupId}/billable_members/${userId}/memberships`,
      options,
    );
  }
}
