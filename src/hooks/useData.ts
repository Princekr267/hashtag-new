import { useState, useEffect } from 'react';

export interface Socials {
  github: string;
  linkedin: string;
  instagram: string;
  twitter: string;
}

export interface Society {
  name: string;
  tagline: string;
  founded: string;
  members: number;
  projects: number;
  events: number;
  socials: Socials;
}

export interface NavbarData {
  logo: string;
  links: string[];
}

export interface HeroData {
  headline: string;
  subheadline: string;
  cta_primary: string;
  cta_secondary: string;
}

export interface Pillar {
  icon: string;
  title: string;
  desc: string;
}

export interface AboutData {
  description: string;
  pillars: Pillar[];
}

export interface SiteEvent {
  id: number;
  title: string;
  date: string;
  type: string;
  description: string;
  image: string;
  registrationLink?: string;
}

export interface TeamMember {
  id: number;
  name: string;
  role: string;
  domain: string;
  avatar: string;
  github: string;
  linkedin: string;
}

export interface ProjectData {
  id: number;
  title: string;
  description: string;
  tech: string[];
  github: string;
  live: string;
  image: string;
  featured: boolean;
}

export interface Testimonial {
  id: number;
  name: string;
  role: string;
  quote: string;
  avatar: string;
}

export interface SiteData {
  society: Society;
  navbar: NavbarData;
  hero: HeroData;
  about: AboutData;
  events: SiteEvent[];
  team: TeamMember[];
  projects: ProjectData[];
  testimonials: Testimonial[];
  blogs: Blog[];
  alumni: Alumni[];
}

export interface Blog {
  id: number;
  title: string;
  author: string;
  date: string;
  tag: string;
  excerpt: string;
  image: string;
  link: string;
}

export interface Alumni {
  id: number;
  name: string;
  batch: string;
  currentRole: string;
  avatarUrl: string;
  linkedin: string;
  github: string;
}

export function useData() {
  const [data, setData] = useState<SiteData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetch('/data/data.json')
      .then(res => {
        if (!res.ok) throw new Error('Network response was not ok');
        return res.json();
      })
      .then((json: SiteData) => {
        setData(json);
        setLoading(false);
      })
      .catch((err: Error) => {
        console.error('Failed to load data.json', err);
        setError(err);
        setLoading(false);
      });
  }, []);

  return { data, loading, error };
}
