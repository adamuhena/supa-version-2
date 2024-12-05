// import React, { useState } from "react"
// import { X } from 'lucide-react'
// import { Command as CommandPrimitive } from "cmdk"
// import { Badge } from "@/components/ui/badge"
// import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command"

// const MultiSelect = ({ options, selected, onChange, placeholder }) => {
//   const [open, setOpen] = useState(false)

//   const handleUnselect = (option) => {
//     onChange(selected.filter((item) => item !== option.value))
//   }

//   return (
//     <Command className="overflow-visible bg-transparent">
//       <div className="group border border-input px-3 py-2 text-sm ring-offset-background rounded-md focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
//         <div className="flex gap-1 flex-wrap">
//           {selected.map((item) => {
//             const option = options.find((option) => option.value === item)
//             return (
//               <Badge key={item} variant="secondary">
//                 {option?.label}
//                 <button
//                   className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
//                   onKeyDown={(e) => {
//                     if (e.key === "Enter") {
//                       handleUnselect(option)
//                     }
//                   }}
//                   onMouseDown={(e) => {
//                     e.preventDefault()
//                     e.stopPropagation()
//                   }}
//                   onClick={() => handleUnselect(option)}
//                 >
//                   <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
//                 </button>
//               </Badge>
//             )
//           })}
//           <CommandInput
//             placeholder={placeholder}
//             className="ml-2 bg-transparent outline-none placeholder:text-muted-foreground flex-1"
//             onInput={handleInputChange} // Add this line
//           />
//         </div>
//       </div>
//       <div className="relative mt-2">
//         {open && (
//           <CommandPrimitive.List className="absolute w-full z-10 h-full max-h-[300px] overflow-auto rounded-md border bg-popover text-popover-foreground shadow-md outline-none animate-in">
//             <CommandEmpty>No results found.</CommandEmpty>
//             <CommandGroup>
//               {options.map((option) => {
//                 const isSelected = selected.includes(option.value)
//                 return (
//                   <CommandItem
//                     key={option.value}
//                     onSelect={() => {
//                       if (isSelected) {
//                         onChange(selected.filter((item) => item !== option.value))
//                       } else {
//                         onChange([...selected, option.value])
//                       }
//                       setOpen(true)
//                     }}
//                   >
//                     <div
//                       className={`mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary ${
//                         isSelected
//                           ? "bg-primary text-primary-foreground"
//                           : "opacity-50 [&_svg]:invisible"
//                       }`}
//                     >
//                       <X className="h-4 w-4" />
//                     </div>
//                     {option.label}
//                   </CommandItem>
//                 )
//               })}
//             </CommandGroup>
//           </CommandPrimitive.List>
//         )}
//       </div>
//     </Command>
//   )
// }

// export default MultiSelect

import React, { useState } from "react";
import { X } from "lucide-react";
import { Command as CommandPrimitive } from "cmdk";
import { Badge } from "@/components/ui/badge";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";

const MultiSelect = ({ options, selected, onChange, placeholder }) => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [filteredOptions, setFilteredOptions] = useState(options);

  const handleUnselect = (option) => {
    onChange(selected.filter((item) => item !== option.value));
  };

//   const handleInputChange = (e) => {
//     const query = e.target.value.toLowerCase();
//     setQuery(query);
//     const filteredOptions = options.filter((option) =>
//       option.label.toLowerCase().includes(query)
//     );
//     setFilteredOptions(filteredOptions);
//     setOpen(true);
//   };

const handleInputChange = (e) => {
    const query = e.target.value.trim().toLowerCase();
    setQuery(query);
    const filteredOptions = options.filter((option) => {
      const label = option.label?.toString().toLowerCase();
      return label.includes(query);
    });
    setFilteredOptions(filteredOptions);
    setOpen(query.length > 0); // Toggle open state based on input value
  };
  const handleSelect = (option) => {
    if (selected.includes(option.value)) {
      onChange(selected.filter((item) => item !== option.value));
    } else {
      onChange([...selected, option.value]);
    }
    setQuery("");
    setFilteredOptions(options);
    setOpen(false);
  };

  return (
    <Command className="overflow-visible bg-transparent">
      <div className="group border border-input px-3 py-2 text-sm ring-offset-background rounded-md focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
        <div className="flex gap-1 flex-wrap">
          {selected.map((item) => {
            const option = options.find((option) => option.value === item);
            return (
              <Badge key={item} variant="secondary">
                {option?.label}
                <button
                  className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleUnselect(option);
                    }
                  }}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  onClick={() => handleUnselect(option)}
                >
                  <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                </button>
              </Badge>
            );
          })}
          <CommandInput
            placeholder={placeholder}
            className="ml-2 bg-transparent outline-none placeholder:text-muted-foreground flex-1"
            value={query}
            onInput={handleInputChange}
          />
        </div>
      </div>
      <div className="relative mt-2" style={{ position: 'relative'}}>
        {open && (
        //   <CommandPrimitive.List className="absolute w-full z-10 h-full max-h-[300px] overflow-auto rounded-md border bg-popover text-popover-foreground shadow-md outline-none animate-in">
        <CommandPrimitive.List
  className="absolute w-full z-10 h-full max-h-[300px] overflow-auto rounded-md border bg-popover text-popover-foreground shadow-md outline-none animate-in"
  style={{ zIndex: 1000, minHeight: '200px' }} // Add this line
>    
        {filteredOptions.length === 0 && (
              <CommandEmpty>No results found.</CommandEmpty>
            )}
            <CommandGroup>
              {filteredOptions.map((option) => {
                const isSelected = selected.includes(option.value);
                return (
                  <CommandItem
                    key={option.value}
                    onSelect={() => handleSelect(option)}
                  >
                    <div
                      className={`mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary ${
                        isSelected
                          ? "bg-primary text-primary-foreground"
                          : "opacity-50 [&_svg]:invisible"
                      }`}
                    >
                      <X className="h-4 w-4" />
                    </div>
                    {option.label}
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandPrimitive.List>
        )}
      </div>
    </Command>
  );
};

export default MultiSelect;