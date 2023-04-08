"use client"

import * as React from "react"
import * as LabelPrimitive from "@radix-ui/react-label"

import { cn } from "~/lib/utils"

const Label = React.forwardRef<
    React.ElementRef<typeof LabelPrimitive.Root>,
    React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> & {
        label: string
    }
>(({ className, label, ...props }, ref) => {
    if (!props.children)
        return (
            <LabelPrimitive.Root
                ref={ref}
                className={cn(
                    "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
                    className
                )}
                {...props}
            />
        )
    return (
        <div className="grid w-full items-center gap-1.5">
            <LabelPrimitive.Root
                ref={ref}
                className={cn(
                    "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
                    className
                )}
                {...props}
            >
                {label}
            </LabelPrimitive.Root>
            {props.children}
        </div>
    )

}
)
Label.displayName = LabelPrimitive.Root.displayName

export { Label }
