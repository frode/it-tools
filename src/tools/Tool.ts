import type { Component } from 'vue';

export interface ITool {
  name: string;
  path: string;
  description: string;
  keywords: string[];
  component: () => Promise<Component>;
  icon: Component;
  redirectFrom?: string[];
}

export interface ToolCategory {
  name: string;
  icon: Component;
  components: ITool[];
}
