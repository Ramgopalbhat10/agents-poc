export type Id = string;

export interface News {
  id: Id;
  title: string;
  body: string;
  date: string;
  tags: string[];
}

export interface Ticket {
  id: Id;
  title: string;
  status: string;
  priority: string;
  assignee: string;
  createdAt: string;
}

export interface Person {
  id: Id;
  name: string;
  title: string;
  team: string;
  managerId: string | null;
  location: string;
  email: string;
}

export interface Desk {
  id: Id;
  location: string;
  name: string;
  amenities: string[];
}

export interface Booking {
  id: Id;
  userId: Id;
  deskId: Id;
  date: string;
  status: string;
}
