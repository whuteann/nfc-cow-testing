import { LayoutProps } from '@/types/Common';
import Meta from '../MetaLayout/Meta';

const Stranger = (props: LayoutProps) => (
  <div className="w-full px-1 antialiased">
    <Meta
      title={props.metaProps?.title || ''}
      description={props.metaProps?.description || ''}
      canonical={props.metaProps?.canonical || ''}
    />

    <div className="mx-auto max-w-screen-md">
      <div className="content text-xl">
        {props.children}
      </div>
    </div>
  </div>
);

export default Stranger;
