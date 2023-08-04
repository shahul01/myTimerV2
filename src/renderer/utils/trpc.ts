import { createTRPCReact } from '@trpc/react-query';
import type { AppRouter } from '../../server';

// eslint-disable-next-line import/prefer-default-export
export const trpc = createTRPCReact<AppRouter>();
