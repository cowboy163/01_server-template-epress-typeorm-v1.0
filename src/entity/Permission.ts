import { IsNotEmpty, Length } from "class-validator";
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Permission {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    @IsNotEmpty()
    @Length(1, 100, {message: "Name out of max characters 100!"})
    name: string;

    @Column({unique: true})
    @IsNotEmpty()
    @Length(1, 50, {message: "code out of max characters 50!"})
    code: string;

    @Column()
    @IsNotEmpty()
    @Length(1, 200, {message: "Description out of max characters 200!"})
    description: string;

    @Column("simple-array", {nullable: true})
    relatedEndpoints: string[];

    @Column({default: true})
    isActive: boolean;

    @Column({default: false})
    isDeleted: boolean;

    @CreateDateColumn({type: "timestamptz",default: () => "CURRENT_TIMESTAMP"})
    createdAt: Date;

    @UpdateDateColumn({type: "timestamptz", default: () => "CURRENT_TIMESTAMP"})
    updatedAt: Date;
}