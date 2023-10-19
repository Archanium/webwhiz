import {Module} from '@nestjs/common';
import {OpenaiService} from './openai.service';
import {RedisModule} from "../common/redis/redis.module";

@Module({
    providers: [OpenaiService],
    exports: [OpenaiService],
    imports: [
        RedisModule,
    ]
})
export class OpenaiModule {
}
