import { ChangeEvent, FormEvent } from "react";

export type InputChange = ChangeEvent<
  HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement | HTMLOptionElement
>;
export type FormSubmit = FormEvent<HTMLFormElement>;

export interface IUser {
  _id: string;
  username: string;
  email: string;
  avatar?: string;
  password?: string;
  cf_password?: string;
  role: string;
  root?: boolean;
  aboutMe?: string;
  isChecked?: boolean;
}

export interface ICategory {
  _id: string;
  name: string;
  slug?: string;
  createdAt?: string;
  updatedAt?: string;
  description?: string;
  isChecked?: boolean;
}

export interface ITag {
  _id: string;
  name: string;
  slug?: string;
  thumbnail: string;
  description: string;
  category: string | ICategory;
  createdAt?: string;
  updatedAt?: string;
  deleted?: string | null;
  isChecked?: boolean;
}

export interface IArticle {
  _id: string;
  title: string;
  slug?: string;
  tag: string | ITag;
  description: string;
  content: string;
  user?: string | IUser;
  createdAt?: string;
  updatedAt?: string;
  isChecked?: boolean;
}

export interface IComment {
  _id: string;
  user: string | IUser;
  articleId: string;
  articleUserId: string;
  content: string;
  replyComment: IComment[];
  replyUser?: string | IUser;
  commentRoot?: string;
  createdAt?: string;
  updatedAt?: string;
  isChecked?: boolean;
}
