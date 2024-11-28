
export interface pagination {
  where: any,
  skip: number,
  take: number,
}

export interface TeamMemberDTO {
  userId?: string;
  teamId?: string;
  role?: string;
  team?: TeamDTO;
}
export interface TeamDTO {
  id?: string;
  name?: string;
  bio?: string;
  address?: string;
  phonenumber?: string;
  email?: string;
  avatar?: string;
  member?: TeamMemberDTO[];
}