import Image, { StaticImageData} from "next/image";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import { CompletedService } from "../(provider-layout)/provider/[id]/profile/page";


  
  
   
const PortfolioCard = ({
    item,
    onEdit,
    onDelete,
  }: {
    item: CompletedService;
    onEdit: (item: CompletedService) => void;
    onDelete: (id: number) => void;
  }) => {
    return (
      <div className="group bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg">
        <div className="relative">
          <div className="relative h-48 w-full">
            <Image
              src={item.mediaUrl ?? ''}
              alt={`portfolio item ${item.id}`}
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              fill
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <h3 className="absolute bottom-4 left-4 text-white text-xl font-semibold">
              {item.title}
            </h3>
          </div>
        </div>
        <div className="p-4">
          <p className="text-gray-600 line-clamp-2">{item.description}</p>
        </div>
        <div className="flex justify-end gap-2 p-4 pt-0">
          <button
            onClick={() => onEdit(item)}
            className="inline-flex items-center px-3 py-1.5 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-md transition-colors"
          >
            <FiEdit2 className="h-4 w-4 mr-2" />
            Edit
          </button>
          <button
            onClick={() => onDelete(item.id)}
            className="inline-flex items-center px-3 py-1.5 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors"
          >
            <FiTrash2 className="h-4 w-4 mr-2" />
            Delete
          </button>
        </div>
      </div>
    );
  };

export default PortfolioCard;