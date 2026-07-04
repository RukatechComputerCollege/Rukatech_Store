import { GiProcessor, GiLaptop } from 'react-icons/gi';
import { FaTabletAlt } from 'react-icons/fa';
import { MdMonitor, MdHeadphonesBattery } from 'react-icons/md';
import { FcMultipleSmartphones } from 'react-icons/fc';
import { TiThSmallOutline } from 'react-icons/ti';

const defaultImage = 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=900&q=80';

export const categoryMeta = {
  laptops: {
    name: 'laptops',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8YXBwbGUlMjBsYXB0b3B8ZW58MHx8MHx8fDA%3D',
    icon: GiLaptop,
  },
  accessories: {
    name: 'accessories',
    image: 'https://images.unsplash.com/photo-1678851836066-dc27614cc56b?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fGdhZGdldHMlMjBhY2Nlc3Nvcmllc3xlbnwwfHwwfHx8MA%3D%3D',
    icon: MdHeadphonesBattery,
  },
  phones: {
    name: 'phones',
    image: 'https://images.unsplash.com/photo-1742108273412-7e020daf956f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHBob25lc3xlbnwwfHwwfHx8MA%3D%3D',
    icon: FcMultipleSmartphones,
  },
  monitors: {
    name: 'monitors',
    image: 'https://images.unsplash.com/photo-1616763355548-1b606f439f86?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bW9uaXRvcnN8ZW58MHx8MHx8fDA%3D',
    icon: MdMonitor,
  },
  tablets: {
    name: 'tablets',
    image: 'https://images.unsplash.com/photo-1622531636820-5d727319e45d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8dGFibGV0c3xlbnwwfHwwfHx8MA%3D%3D',
    icon: FaTabletAlt,
  },
  processors: {
    name: 'processors',
    image: 'https://plus.unsplash.com/premium_photo-1681426698212-53e47fec9a2c?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTN8fHByb2Nlc3NvcnN8ZW58MHx8MHx8fDA%3D',
    icon: GiProcessor,
  },
  default: {
    name: 'default',
    image: defaultImage,
    icon: TiThSmallOutline,
  },
};

export const getCategoryMeta = (categoryName) => {
  if (!categoryName) return categoryMeta.default;

  const normalizedName = String(categoryName).trim().toLowerCase();
  return categoryMeta[normalizedName] || categoryMeta.default;
};
