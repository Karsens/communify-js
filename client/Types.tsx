import { StackNavigationProp } from "@react-navigation/stack";

export interface Device {
  loginToken: string;
  logged: boolean;
}

export type Navigation = StackNavigationProp<any>;
export interface Me {
  id: number;
  username: string;
  name: string;
  image: string;
  thumbnail: string;
  level: number;
  bio: string;
  tribes: Tribe[];
}

export interface Tribe {
  fid: number;
  name: string;
  slug: string;
  image: string;
  thumbnail: string;
  bio: string;
  tagline: string;
  code: string;
  open: boolean;
}

export interface Franchise {
  name: string;
  slug: string;
  image: string;
  thumbnail: string;
  bio: string;
  primaryColor: string;
  secondaryColor: string;
}

export interface Global {
  device: Device;
  me: Me;
  franchise: Franchise;
  tribe: Tribe;

  dispatch: ({ type, value }: { type: string; value: any }) => void;
  reloadTribe: (loginToken: string, slug: string) => void;
  reloadMe: (loginToken: string) => void;
  reloadFranchise: (slug: string) => void;
}
