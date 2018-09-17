using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.SpaServices.Webpack;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;

namespace Travlr.WebApp
{
    public class Startup
    {
        public Startup(IHostingEnvironment env)
        {
            var builder = new ConfigurationBuilder()
                .SetBasePath(env.ContentRootPath)
                .AddJsonFile("appsettings.json", optional: true, reloadOnChange: true)
                .AddJsonFile($"appsettings.{env.EnvironmentName}.json", optional: true)
                .AddEnvironmentVariables();
            Configuration = builder.Build();
        }

        public IConfigurationRoot Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            // Add node.js service
            services.AddNodeServices();
            // Add SPA Prerender service
            services.AddSpaPrerenderer();
            // Add framework services
            services.AddMvc();
        }

        public void ConfigureProductionServices(IServiceCollection services)
        {
            // Add Basic Service
            ConfigureServices(services);

            // Add Response Caching service
            services.AddResponseCaching();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env, ILoggerFactory loggerFactory)
        {
            loggerFactory
                .AddConsole(Configuration.GetSection("Logging"))
                .AddDebug();

            if (env.IsDevelopment())
            {
                app
                    .UseDeveloperExceptionPage()
                    .UseWebpackDevMiddleware(new WebpackDevMiddlewareOptions
                {
                    HotModuleReplacement = true
                });
            }
            else
            {
                app
                    .UseExceptionHandler("/Error")
                    .UseResponseCaching();
            }

            app
                .UseStaticFiles()
                .UseMvc(routes =>
                {
                    routes
                        .MapRoute(
                            name: "default",
                            template: "{controller=Home}/{action=Index}/{id?}")
                        .MapSpaFallbackRoute(
                            name: "spa-fallback",
                            defaults: new { controller = "Home", action = "Index" });
                });
        }
    }
}
