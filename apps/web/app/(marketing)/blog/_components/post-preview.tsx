import Link from 'next/link';

import { Cms } from '@kit/cms';
import { If } from '@kit/ui/if';

import { CoverImage } from '~/(marketing)/blog/_components/cover-image';
import { DateFormatter } from '~/(marketing)/blog/_components/date-formatter';

type Props = {
  post: Cms.ContentItem;
  preloadImage?: boolean;
  imageHeight?: string | number;
};

const DEFAULT_IMAGE_HEIGHT = 250;

export function PostPreview({
  post,
  preloadImage,
  imageHeight,
}: React.PropsWithChildren<Props>) {
  const { title, image, publishedAt, description } = post;
  const height = imageHeight ?? DEFAULT_IMAGE_HEIGHT;

  const slug = `/blog/${post.slug}`;

  return (
    <div className="transition-shadow-sm flex flex-col gap-y-4 rounded-lg duration-500">
      <If condition={image}>
        {(imageUrl) => (
          <div className="relative mb-2 w-full" style={{ height }}>
            <Link href={slug}>
              <CoverImage
                preloadImage={preloadImage}
                title={title}
                src={imageUrl}
              />
            </Link>
          </div>
        )}
      </If>

      <div className={'flex flex-col space-y-4 px-1'}>
        <div className={'flex flex-col space-y-2'}>
          <h2 className="text-xl leading-snug font-semibold tracking-tight">
            <Link href={slug} className="hover:underline">
              {title}
            </Link>
          </h2>

          <div className="flex flex-row items-center gap-x-3 text-sm">
            <div className="text-muted-foreground">
              <DateFormatter dateString={publishedAt} />
            </div>
          </div>
        </div>

        <p
          className="text-muted-foreground mb-4 text-sm leading-relaxed"
          dangerouslySetInnerHTML={{ __html: description ?? '' }}
        />
      </div>
    </div>
  );
}
