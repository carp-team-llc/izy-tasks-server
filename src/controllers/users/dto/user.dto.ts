export interface profileDto {
  id?: string;
  fullName?: string;
  bio?: string;
  dateOfBirth?: Date;
  avatar?: string;
  user?: any;
  socials?: socialsDTO[];
}

export interface socialsDTO {
  platform?: string;
  profileId?: string;
  profile?: string;
  url?: string;
}
