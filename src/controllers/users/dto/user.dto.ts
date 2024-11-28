export interface profileDto {
  id?: string;
  fullName?: string;
  bio?: string;
  dateOfBirth?: Date;
  avatar?: string;
  userId?: string;
  user?: any;
  gender?: string;
  socials?: socialsDTO[];
}

export interface socialsDTO {
  platform?: string;
  profileId?: string;
  profile?: string;
  url?: string;
}
