import type { Core } from '@strapi/strapi';

export default {
  register(/* { strapi }: { strapi: Core.Strapi } */) {},

  bootstrap({ strapi }: { strapi: Core.Strapi }) {
    // Register lifecycle hooks for ISR revalidation
    strapi.db?.lifecycles.subscribe({
      models: ['api::blog.blog', 'api::video.video', 'api::book.book'],
    });
  },
};
