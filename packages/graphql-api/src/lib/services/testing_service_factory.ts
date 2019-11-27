import { ServiceFactory } from "./service_factory";
import { TestingMailer } from "./email/testing_mailer";

export class TestingServiceFactory extends ServiceFactory {
    get emailService() {
        return new TestingMailer();
    }
}
