import React,{FC} from 'react';
import AnnualAwardsSummarySubProgramIndex from "./components/AnnualAwardsSummarySubProgramIndex";

interface AnnualAwardsSummarySubProgramProps {
    program: any
}

const AnnualAwardsSummarySubProgram: FC<AnnualAwardsSummarySubProgramProps> = ({program}) => {
    return (
        <AnnualAwardsSummarySubProgramIndex programid={program.id}/>
    )
}

export default AnnualAwardsSummarySubProgram;
