import DataLoader from "dataloader";
import { Post } from "../entities/Post";
import { Vouch } from "../entities/Vouch";
export const createVouchLoader = () =>
  new DataLoader<{ postId: number; userId: number }, Vouch | null>(
    async (keys) => {
      const vouches = await Vouch.findByIds(keys as any);
      const vouchIdstoVouch: Record<string, Vouch> = {};
      vouches.forEach((vouch) => {
        vouchIdstoVouch[`${vouch.userId}|${vouch.postId}`] = vouch;
      });

      return keys.map((key) => vouchIdstoVouch[`${key.userId}|${key.postId}`]);
    }
  );
