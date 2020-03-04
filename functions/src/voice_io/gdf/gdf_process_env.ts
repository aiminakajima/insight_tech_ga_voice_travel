import { VoiceIO } from '../voice_io_interface';
import * as functions from 'firebase-functions';

export class GDFProcessEnv implements VoiceIO.ProcessEnv
{
    get<T>(key: string): T
    {
        return functions.config()[key] as T;
    }
    
    set<T>(key: string, value: T): void
    {
        functions.config()[key] = value;
    }
    
    all(): any
    {
        return functions.config();
    }
}

