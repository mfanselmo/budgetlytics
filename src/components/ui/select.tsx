/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import Select from 'react-select'
import { Controller } from 'react-hook-form'

export default function CustomSelect({ name, control, isLoading, isDisabled, options, labelName, valueName, error, errorText }: { name: string, control: any, isLoading?: boolean, isDisabled?: boolean, options: { [key: string]: any }[] | undefined, labelName: string, valueName: string, error?: boolean, errorText?: string }) {

    return (
        <>
            <Controller
                name={name}
                control={control}
                render={({ field }) =>
                    <Select

                        unstyled
                        ref={field.ref}
                        name={field.name}
                        value={options?.find(o => o[valueName] == field.value)}
                        onChange={o => field.onChange(o?.[valueName] || null)}
                        isLoading={isLoading}
                        isDisabled={isDisabled}
                        options={options}
                        getOptionLabel={(o: { [key: string]: string }) => o[labelName] as string}
                        getOptionValue={(o: { [key: string]: string }) => o[valueName] as string}
                        classNames={{
                            container: (props) => `flex h-10 w-full items-center justify-between rounded-md border  bg-transparent  text-sm  focus:outline-none cursor-pointer focus:ring-2 focus:ring-slate-400 focus:ring-offset-2  dark:text-slate-50 dark:focus:ring-slate-400 dark:focus:ring-offset-slate-900 ${error ? 'border-rose-500' : 'border-slate-300 dark:border-slate-700'} ${props.isDisabled ? 'cursor-not-allowed opacity-50' : ''}`,
                            control: () => 'w-full py-2 px-2',
                            placeholder: () => 'text-slate-400',
                            menuList: () => 'mt-2 animate-in fade-in-80 relative z-50 min-w-[8rem] overflow-hidden rounded-md border border-slate-100 bg-white text-slate-700 shadow-md dark:border-slate-800 dark:bg-slate-800 dark:text-slate-400',
                            option: () => 'py-1.5 pr-2 pl-8 text-sm font-semibold text-slate-900 dark:text-slate-300 dark:hover:bg-slate-700 hover:bg-slate-100',
                            noOptionsMessage: () => 'py-1.5 pr-2 pl-8 text-sm font-semibold text-slate-900 dark:text-slate-300'
                        }}
                    />
                }
            />
            {error && <p className="text-sm text-rose-500">{errorText}</p>}
        </>

    )
}