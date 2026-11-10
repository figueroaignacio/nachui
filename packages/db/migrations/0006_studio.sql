CREATE TABLE "studio_projects" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"name" text NOT NULL,
	"current_version" integer DEFAULT 0 NOT NULL,
	"last_error" text,
	"pull_request_url" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "studio_sessions" (
	"token_hash" text PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "studio_threads" (
	"project_id" uuid PRIMARY KEY NOT NULL,
	"messages" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "studio_usage" (
	"user_id" uuid NOT NULL,
	"day" text NOT NULL,
	"generations" integer DEFAULT 0 NOT NULL,
	"tokens" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "studio_users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"github_id" text NOT NULL,
	"login" text NOT NULL,
	"name" text,
	"avatar_url" text,
	"repo_token" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "studio_users_github_id_unique" UNIQUE("github_id")
);
--> statement-breakpoint
CREATE TABLE "studio_versions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"project_id" uuid NOT NULL,
	"number" integer NOT NULL,
	"files" jsonb NOT NULL,
	"summary" text,
	"message_id" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "studio_projects" ADD CONSTRAINT "studio_projects_user_id_studio_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."studio_users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "studio_sessions" ADD CONSTRAINT "studio_sessions_user_id_studio_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."studio_users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "studio_threads" ADD CONSTRAINT "studio_threads_project_id_studio_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."studio_projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "studio_usage" ADD CONSTRAINT "studio_usage_user_id_studio_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."studio_users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "studio_versions" ADD CONSTRAINT "studio_versions_project_id_studio_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."studio_projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "studio_projects_user_idx" ON "studio_projects" USING btree ("user_id","updated_at");--> statement-breakpoint
CREATE INDEX "studio_sessions_user_idx" ON "studio_sessions" USING btree ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "studio_usage_user_day" ON "studio_usage" USING btree ("user_id","day");--> statement-breakpoint
CREATE UNIQUE INDEX "studio_versions_project_number" ON "studio_versions" USING btree ("project_id","number");