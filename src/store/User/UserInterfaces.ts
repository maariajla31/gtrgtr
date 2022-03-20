import { Contact, Metadata } from "../Profile/ProfileInterfaces";
import { UnilevelMember } from "../Unilevel/UnilevelInterfaces";

export interface SearchUserResponse extends UnilevelMember {
  coverPictureUrl?: string;
  city?: string;
  state?: string;
  country?: string;
  contact: Contact;
  metadata?: Metadata;
}
